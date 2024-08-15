import express from "express";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import router from "./routes/index.js";
import cookiesParser from "cookie-parser";
import { app, server } from "./socket/index.js";

// const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
//middleware
app.use(express.json());
app.use(cookiesParser());

app.use(
  cors({
    origin: "https://chatapp024.netlify.app", // Allow requests from this origin
    credentials: true, // Enable cookies if needed
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Server Started" });
});
//API endpoints

app.use("/api", router);

server.listen(PORT, () => console.log(`Server started at the PORT: ${PORT}`));
