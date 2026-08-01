import express from "express";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const RECIPIENT_EMAIL = "workwithhomescapes@gmail.com";

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

  // Helper function to create Nodemailer Transporter
  const createEmailTransporter = async () => {
    const user = process.env.SMTP_USER || process.env.GMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
    const host = process.env.SMTP_HOST || (user ? 'smtp.gmail.com' : null);

    if (host && user && pass) {
      return {
        isSandbox: false,
        transporter: nodemailer.createTransport({
          host,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Boolean(process.env.SMTP_SECURE === "true"),
          auth: { user, pass },
        })
      };
    }

    // Fallback: Create test account if no SMTP provided
    try {
      const testAccount = await nodemailer.createTestAccount();
      return {
        isSandbox: true,
        transporter: nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        })
      };
    } catch (err) {
      console.warn("Could not create Ethereal test account, fallback to direct send:", err);
      return {
        isSandbox: true,
        transporter: nodemailer.createTransport({
          jsonTransport: true
        })
      };
    }
  };

  // Function to build and send the daily digest email containing all form submissions
  const sendDailyDigestEmail = async () => {
    try {
      const store = loadStore();
      const consultations = store.consultations || [];
      const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

      let emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #F8F5F2; color: #1F1F1F;">
          <div style="max-width: 650px; margin: 0 auto; background: #ffffff; padding: 30px; border: 1px solid #B58E5B;">
            <div style="border-b: 2px solid #B58E5B; padding-bottom: 15px; margin-bottom: 20px;">
              <h2 style="color: #B58E5B; margin: 0; font-family: Georgia, serif;">Homescapes Architecture & Interiors</h2>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 2px;">
                Daily Form Submissions & Consultation Leads Summary
              </p>
            </div>

            <p style="font-size: 14px; color: #333;">
              Hello Homescapes Team,
            </p>
            <p style="font-size: 14px; color: #555;">
              Here is the scheduled daily summary of all client consultation submissions currently stored in <strong>Server-Side Persistent Storage</strong> (<code>/data/cms_store.json</code>) as of <strong>${timestamp}</strong>:
            </p>

            <h3 style="color: #1F1F1F; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 25px;">
              Submitted Consultations (${consultations.length})
            </h3>
      `;

      if (consultations.length === 0) {
        emailHtml += `
          <p style="font-style: italic; color: #888; font-size: 13px; padding: 15px; background: #f9f9f9; text-align: center;">
            No client consultation requests recorded yet.
          </p>
        `;
      } else {
        consultations.forEach((item: any, idx: number) => {
          emailHtml += `
            <div style="background: #FAF8F5; border: 1px solid #D8CBBE; padding: 15px; margin-bottom: 15px; border-left: 4px solid #B58E5B;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <strong style="font-size: 16px; color: #1F1F1F;">${idx + 1}. ${item.name || "Client"}</strong>
                <span style="font-size: 11px; background: #B58E5B; color: #fff; padding: 2px 8px; border-radius: 2px;">${item.status || "Pending"}</span>
              </div>
              <table style="width: 100%; font-size: 13px; color: #444; border-collapse: collapse;">
                <tr><td style="padding: 3px 0; width: 120px; font-weight: bold;">Email:</td><td><a href="mailto:${item.email}" style="color: #B58E5B;">${item.email || "N/A"}</a></td></tr>
                <tr><td style="padding: 3px 0; font-weight: bold;">Phone:</td><td>${item.phone || "N/A"}</td></tr>
                <tr><td style="padding: 3px 0; font-weight: bold;">Location:</td><td>${item.location || "N/A"}</td></tr>
                <tr><td style="padding: 3px 0; font-weight: bold;">Preferred Date:</td><td>${item.preferredDate || "N/A"} at ${item.preferredTime || "N/A"}</td></tr>
                <tr><td style="padding: 3px 0; font-weight: bold;">Project Category:</td><td>${item.projectType || "N/A"}</td></tr>
                <tr><td style="padding: 3px 0; font-weight: bold;">Budget:</td><td>${item.estimatedBudget || "N/A"}</td></tr>
                ${item.notes ? `<tr><td style="padding: 3px 0; font-weight: bold;">Client Notes:</td><td>${item.notes}</td></tr>` : ""}
                <tr><td style="padding: 3px 0; font-weight: bold; font-size: 11px; color: #888;">Submitted:</td><td style="font-size: 11px; color: #888;">${item.createdAt || "N/A"}</td></tr>
              </table>
            </div>
          `;
        });
      }

      emailHtml += `
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 11px; color: #888; text-align: center;">
              Homescapes Architecture & Interior Design Studio • Lucknow, India • Sent automatically by Server Scheduler
            </div>
          </div>
        </div>
      `;

      const { transporter, isSandbox } = await createEmailTransporter();
      const mailOptions = {
        from: '"Homescapes Studio System" <no-reply@homescapes.in>',
        to: RECIPIENT_EMAIL,
        subject: `[Daily Report] Homescapes Form Submissions & Consultation Requests (${consultations.length})`,
        html: emailHtml
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[Daily Scheduler Email] Sent digest to ${RECIPIENT_EMAIL}. Message ID: ${info.messageId}`);
      
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`[Ethereal Email Preview URL]: ${previewUrl}`);
      }

      return {
        success: true,
        count: consultations.length,
        messageId: info.messageId,
        isSandbox,
        previewUrl: previewUrl || null,
        recipient: RECIPIENT_EMAIL,
        message: isSandbox
          ? `Email report created for ${consultations.length} form submission(s). Running in sandbox mode because SMTP environment variables (SMTP_USER & SMTP_PASS) are not set.`
          : `Daily form data report sent successfully to ${RECIPIENT_EMAIL}`
      };
    } catch (err: any) {
      console.error("[Daily Scheduler Email Error]:", err);
      throw err;
    }
  };

  // Schedule Trigger for Everyday Execution (runs every 24 hours)
  const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
  setInterval(() => {
    console.log("[Scheduler] Triggering 24-hour daily form data email dispatch...");
    sendDailyDigestEmail().catch(err => console.error("Scheduled email failed:", err));
  }, TWENTY_FOUR_HOURS_MS);

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

  // Specifically update Founder Data
  app.post("/api/cms/founder", (req, res) => {
    try {
      const founderData = req.body;
      const saved = saveStore({ founderData });
      res.json({ success: true, founderData: saved.founderData });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to update founder photo on server" });
    }
  });

  // Admin trigger endpoint to manually dispatch the everyday email report on demand
  app.post("/api/admin/trigger-daily-digest", async (req, res) => {
    try {
      const result = await sendDailyDigestEmail();
      res.json({
        success: true,
        message: `Daily form data email successfully sent to ${RECIPIENT_EMAIL}`,
        details: result
      });
    } catch (e: any) {
      res.status(500).json({
        error: e.message || "Failed to execute daily email trigger"
      });
    }
  });

  app.get("/api/admin/trigger-daily-digest", async (req, res) => {
    try {
      const result = await sendDailyDigestEmail();
      res.json({
        success: true,
        message: `Daily form data email successfully sent to ${RECIPIENT_EMAIL}`,
        details: result
      });
    } catch (e: any) {
      res.status(500).json({
        error: e.message || "Failed to execute daily email trigger"
      });
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
