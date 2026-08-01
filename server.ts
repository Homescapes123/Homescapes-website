import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Allow large base64 image uploads for founder photos & project images
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const storeFilePath = path.join(dataDir, "cms_store.json");

  // Helper to load current store
  const loadStore = () => {
    if (fs.existsSync(storeFilePath)) {
      try {
        const content = fs.readFileSync(storeFilePath, "utf-8");
        return JSON.parse(content);
      } catch (e) {
        console.error("Error reading cms_store.json:", e);
      }
    }
    return {};
  };

  // Helper to save store
  const saveStore = (updatedStore: Record<string, any>) => {
    try {
      const current = loadStore();
      const merged = { ...current, ...updatedStore, updatedAt: new Date().toISOString() };
      fs.writeFileSync(storeFilePath, JSON.stringify(merged, null, 2), "utf-8");
      return merged;
    } catch (e) {
      console.error("Error writing cms_store.json:", e);
      throw e;
    }
  };

  // API Endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Get all CMS data from server
  app.get("/api/cms/store", (req, res) => {
    const store = loadStore();
    res.json(store);
  });

  // Save/Sync entire CMS store
  app.post("/api/cms/store", (req, res) => {
    try {
      const saved = saveStore(req.body);
      res.json({ success: true, store: saved });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to save CMS store" });
    }
  });

  // Specifically update Founder Data (so photo changes reflect server-wide)
  app.post("/api/cms/founder", (req, res) => {
    try {
      const founderData = req.body;
      const saved = saveStore({ founderData });
      res.json({ success: true, founderData: saved.founderData });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to update founder photo on server" });
    }
  });

  // Vite middleware setup for development vs production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Homescapes CMS Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
