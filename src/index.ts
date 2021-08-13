require("dotenv").config();

import express from "express";
import { ApolloServer } from "apollo-server-express";
import api from "./api";
import webhook from "./webhook";

const startServer = async () => {
  const apolloServer = new ApolloServer(api);
  await apolloServer.start();

  const path = "/graphql";
  const app: express.Application = express();
  app.use(path, (req, res, next) => {
    // console.log("in middleware", req);
    (req as any).user = { name: "abreham" };
    next();
  });
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
