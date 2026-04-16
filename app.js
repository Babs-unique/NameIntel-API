const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const nameRoutes = require("./src/routes/profile.routes");
const connectDB = require("./src/config/db");


dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    origin: "*",
}));



app.use('/api', nameRoutes);





app.use("/", (req,res) =>{
    res.json({message: "Welcome to NameIntel API"});
})


module.exports = app;