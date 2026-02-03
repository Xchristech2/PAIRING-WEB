import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import qrRouter from "./qr.js";
import pairRouter from "./pair.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔑 Ensure auth folder exists
const authPath = path.join(__dirname, "auth_info");
if (!fs.existsSync(authPath)) {
  fs.mkdirSync(authPath);
}

const PORT = process.env.PORT || 3000;

// Prevent memory warnings
import("events").then(events => {
  events.EventEmitter.defaultMaxListeners = 1000;
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Serve frontend correctly
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/qr", qrRouter);
app.use("/code", pairRouter);

// Pages
app.get("/pair", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pair.html"));
});

app.get("/qrpage", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "qr.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.html"));
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
