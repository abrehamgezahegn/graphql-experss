import express from "express";
import cors from "cors";
import shopifyRouter from "./shopify";

const webhook = (app) => {
  app.use(cors());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use(express.json());
  app.use("/shopify", shopifyRouter);

  app.get("/", (req, res) => {
    res.json("webhook running");
  });
};

export default webhook;
