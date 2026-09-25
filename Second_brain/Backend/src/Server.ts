import express from "express"
import  connectDB from "./config/db"
 
import dotenv from "dotenv";
import authRoutes from "../src/routes/auth.routes"
import ContentRoutes from"../src/routes/content.routes"
import shareRoutes from "../src/routes/share.routes"
import { generalLimiter } from "./middleware/rateLimit.middleware";
import cookieParser from "cookie-parser";

 
dotenv.config();

const app = express()
const port = 8000

app.use(generalLimiter);
app.use(express.json());
app.use(cookieParser());
import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


 

connectDB()
app.get("/test", (req, res) => {
    res.json({
        message: "Server is working"
    });
});
 
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/content", ContentRoutes);
app.use("/api/v1/share",shareRoutes);

app.listen(port, () => {
    console.log(`The server is running on ${port}`)
})

