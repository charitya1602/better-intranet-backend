import express from "express";
import { connectDB } from "./db/db.js";
import { authRouter, fileRouter } from "./routes/api/index.js";
import { config } from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

config();
connectDB();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use("/", authRouter);
app.use("/fs", fileRouter);
app.listen(port, () => console.log(`Listening... on port ${port}`));
