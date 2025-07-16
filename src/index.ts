import express from "express";
import "dotenv/config";
import cors from 'cors'
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";


const app = express()
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.ORIGIN }));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth',authRouter)

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});