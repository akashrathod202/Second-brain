import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db";

import authRoutes from "./routes/auth.routes";
import ContentRoutes from "./routes/content.routes";
import shareRoutes from "./routes/share.routes";

import { generalLimiter } from "./middleware/rateLimit.middleware";

dotenv.config();

const app = express();
const port = 8000;

/* =========================
   CORS
========================= */

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

/* =========================
   Middleware
========================= */

app.use(express.json());
app.use(cookieParser());

/*
  Rate limiter should come AFTER CORS
  so preflight requests receive CORS headers.
*/
app.use(generalLimiter);

/* =========================
   Database
========================= */

connectDB();

/* =========================
   Test Route
========================= */

app.get("/test", (req, res) => {
    res.json({
        message: "Server is working",
    });
});

/* =========================
   Routes
========================= */

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/content", ContentRoutes);

app.use("/api/v1/share", shareRoutes);

/* =========================
   Start Server
========================= */

app.listen(port, () => {
    console.log(`The server is running on http://localhost:${port}`);
});