import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

// Serves the Vercel Functions in /api during `vite` dev, so forms work locally without the Vercel CLI.
// Each api/<name>.ts exports handlers named after HTTP methods: (request: Request) => Response.
function vercelApiDev(): Plugin {
  return {
    name: 'vercel-api-dev',
    apply: 'serve',
    configResolved(config) {
      // Expose server-only .env values (RESEND_API_KEY, ...) to the functions, as Vercel does.
      for (const [key, value] of Object.entries(loadEnv(config.mode, config.root, ''))) {
        process.env[key] ??= value;
      }
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const name = req.url?.match(/^\/api\/([\w-]+)\/?(?:\?|$)/)?.[1];
        if (!name) return next();
        const file = path.resolve(__dirname, 'api', `${name}.ts`);
        if (!fs.existsSync(file)) {
          res.statusCode = 404;
          return res.end('Not found');
        }
        try {
          const handler = (await server.ssrLoadModule(file))[req.method ?? 'GET'];
          if (typeof handler !== 'function') {
            res.statusCode = 405;
            return res.end('Method not allowed');
          }
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
          }
          // Vercel sets the client address; mirror it so per-IP rate limiting behaves the same locally.
          if (!headers.has('x-real-ip') && req.socket.remoteAddress) headers.set('x-real-ip', req.socket.remoteAddress);
          const response: Response = await handler(
            new Request(new URL(req.url!, `http://${req.headers.host}`), {
              method: req.method,
              headers,
              body: chunks.length ? Buffer.concat(chunks) : undefined
            })
          );
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (err) {
          server.ssrFixStacktrace(err as Error);
          next(err);
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), vercelApiDev()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
