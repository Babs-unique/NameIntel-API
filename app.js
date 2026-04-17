import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import nameRoutes from "./src/routes/profile.routes.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    origin: "*",
}));

app.use('/api', nameRoutes);

app.get("/", (req,res) =>{
    res.json({message: "Welcome to NameIntel API"});
})

export default app;