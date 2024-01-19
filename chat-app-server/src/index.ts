import express, { Express, Application, Request, Response, json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { connect as connectToDB } from "../config/db";
import { router } from "./routes/index";
import io from 'socket.io';
import getCredFromToken from "./helpers/getCredentialsFromToken";

dotenv.config();

const app: Application = express();

connectToDB();
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: [process.env.FRONTEND_URL!],
}));
app.use(json());
app.use(urlencoded({
  extended: true,
}));

const port = process.env.PORT;

app.use(router);


const server = app.listen(port, () => {
  console.log(`Listening to port ${port}`);
})

const ioInstance = new io.Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL!],
    credentials: true,
  }
});

app.set('io', ioInstance);

ioInstance.on('connection', (socket) => {
  if (socket.handshake.headers.cookie) {
    const result = getCredFromToken(socket.handshake.headers.cookie);
    if (typeof result === "string") {
      console.log("where token?");
    }
  }
});