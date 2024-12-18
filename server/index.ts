import fs from "fs";
import path from "path";
import http from "http";
import https from "https";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

import { config } from "./config";
import { authenticateToken } from "./middleware/auth";

import authRoutes from "./routes/auth";
import analyticsRoutes from "./routes/analytics";
import organizationsRoutes from "./routes/organizations";
import storesRoutes from "./routes/stores";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials, // Allow cookies and credentials
  })
);

app.use(cookieParser());

const clientBuildPath = path.join(__dirname, "..", "dist");

// Serve static files from the React build directory
app.use(express.static(clientBuildPath));

// Auth routes (public)
app.use("/api/auth", authRoutes);

// Protected routes example
app.use("/api/v1", authenticateToken); // Protect all routes under /api

app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/organizations", organizationsRoutes);
app.use("/api/v1/stores", storesRoutes);

// not found handler for /api endpoints
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: `${req.originalUrl} not a valid endpoint` });
});

// Serve React app for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// Error handling
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
);

// Create HTTP or HTTPS server based on environment
// let server;
// if (process.env.NODE_ENV === "production") {
//   const privateKey = fs.readFileSync(config.ssl.privateKeyPath, "utf8");
//   const certificate = fs.readFileSync(config.ssl.certificatePath, "utf8");
//   const credentials = { key: privateKey, cert: certificate };
//   server = https.createServer(credentials, app);
// } else {
 const server = http.createServer(app);
// }

server.listen(config.port, () => {
  console.log(
    `Server running on port ${config.port} (${process.env.NODE_ENV} mode)`
  );
});
