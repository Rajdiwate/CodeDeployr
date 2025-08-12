import cookieParser from "cookie-parser";
import express from "express";
import { createClient } from "redis";
import cors from "cors";
import { errorMiddleware } from "./middleware/error";
import { config } from "dotenv";

config();

export const client: ReturnType<typeof createClient> = createClient({
  url: "redis://localhost:6379",
});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const init = async () => {
  await client
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect()
    .then(() => console.log("redis connected"));
};

import router from "./routes";
app.use(router);

app.use(errorMiddleware); // catch all errors

// start the server
init()
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log("app listening on 3001");
    });
  })
  .catch((err) => console.log(err));
