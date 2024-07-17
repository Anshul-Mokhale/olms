import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Log to verify the value of CORS_ORIGIN
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);

const corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Removed trailing slash
    credentials: false // Set to true if you need to send cookies or HTTP authentication information
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import adminRouter from "./routes/admin.routes.js";
import userRouter from "./routes/user.routes.js";

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);

export { app };
