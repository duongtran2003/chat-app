import express, { Express, Application, Request, Response, json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { connect as connectToDB } from "../config/db";
import { router } from "./routes/index";

dotenv.config();

const app: Application = express();

connectToDB();
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL,
}));
app.use(json());
app.use(urlencoded({
  extended: true,
}));

const port = process.env.PORT;

app.use(router);


app.listen(port, () => {
  console.log(`Listening to port ${port}`);
})
