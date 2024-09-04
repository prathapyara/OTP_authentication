import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connect } from "./database/conn.js";
import router from "./router/route.js";

dotenv.config();

connect();

const app=express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.send("home is very good");
});

app.use("/api",router);

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})