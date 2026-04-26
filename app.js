import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import nameRoutes from "./src/routes/profile.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import connectDB from "./src/config/db.js";
import checkVersion from "./src/middleware/versionMiddleware.js";
dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    origin: "*",
}));
app.use(checkVersion)

app.use('/api', nameRoutes);
app.use('/api/auth', authRoutes);
app.get("/", (req,res) =>{
    res.json({message: "Welcome to NameIntel API"});
})

export default app;