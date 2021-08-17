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

  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );
  app.use(cookieParser());

  app.use(
    session({
      name: "test_test_test_shopify",
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: false,
        secure: false, // cookie only works in https
      },
      saveUninitialized: false,
      secret: "robustDonkey",
      resave: false,
    })
  );

  // returns an object with the cookies' name as keys
  const getAppCookies = (req) => {
    // We extract the raw cookies from the request headers
    const rawCookies = req.headers.cookie.split("; ");
    // rawCookies = ['myapp=secretcookie, 'analytics_cookie=beacon;']

    const parsedCookies = {};
    rawCookies.forEach((rawCookie) => {
      const parsedCookie = rawCookie.split("=");
      // parsedCookie = ['myapp', 'secretcookie'], ['analytics_cookie', 'beacon']
      parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });
    return parsedCookies;
  };

  app.use((req, res, next) => {
    console.log("req header", req.headers);
    console.log("in middleware cookies", req.cookies);
    // const cookies = getAppCookies(req);
    // console.log("cookies from get app cookies", cookies);

    next();
  });

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
