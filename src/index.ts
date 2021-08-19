require("dotenv").config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import api from "./api";
import webhook from "./webhook";
import session from "express-session";
import firebaseValidation from "./middleware/firebaseValidation";

const startServer = async () => {
  const apolloServer = new ApolloServer(api);
  await apolloServer.start();

  const path = "/graphql";
  const app: express.Application = express();

  app.use(express.static("public"));

  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );

  app.use(path, (req, res, next) => firebaseValidation(req, res, next));

  apolloServer.applyMiddleware({ app, path });
  webhook(app);

  const HOSTNAME = process.env.HOSTNAME || "0.0.0.0";
  const PORT = Number(process.env.PORT) || 4444;

  const server = app.listen(PORT, HOSTNAME, () => {
    const address = server.address();
    const origin = !address
      ? "unknown address"
      : typeof address === "string"
      ? address
      : "http://" + address.address + ":" + address.port;

    console.info(`\nExpress server listening at ${origin}`);
    console.info(
      `\nGraphQL ready at ${address ? origin : ""}${apolloServer.graphqlPath}`
    );
  });
};

startServer();
