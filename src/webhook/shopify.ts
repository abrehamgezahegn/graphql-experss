import * as express from "express";
import Shopify, { ApiVersion, AuthQuery } from "@shopify/shopify-api";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const router = express.Router();

const {
  API_KEY,
  API_SECRET_KEY,
  SCOPES,
  FRONTEND_URL,
  FRONTEND_REGISTER_PATH,
  HOST,
  ACCESS_TOKEN,
  SHOP,
  JWT_SECRET,
} = process.env;

Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES: [SCOPES],
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  IS_EMBEDDED_APP: false,
  API_VERSION: ApiVersion.October20, // all supported versions are available, as well as "unstable" and "unversioned"
});

router.get("/", async (req, res) => {
  res.json("shopify webhook working");
});

router.get("/install", async (req, res) => {
  console.log("install hitttt");
  let authRoute = await Shopify.Auth.beginAuth(
    req,
    res,
    req.query.shop as string,
    "/shopify/auth/callback",
    false
  );
  return res.redirect(authRoute);
});

router.get("/auth/callback", async (req, res) => {
  try {
    await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query as unknown as AuthQuery
    );

    const session = await Shopify.Utils.loadOfflineSession(
      req.query.shop as string
    );

    const id = uuidv4();
    try {
      // const shopifySession = await prisma.storeSession.create({
      //   data: {
      //     id: id,
      //     shop: session.shop,
      //     shopId: session.id,
      //     accessToken: session.accessToken,
      //   },
      // });

      //todo: remove when done testing
      const shopifySession = await prisma.storeSession.upsert({
        where: {
          shopId: session.id,
        },
        update: {
          shop: session.shop,
          accessToken: session.accessToken,
        },
        create: {
          id: id,
          shop: session.shop,
          shopId: session.id,
          accessToken: session.accessToken,
        },
      });
    } catch (error) {
      console.log("create store session error", error);
      return res.redirect(`${FRONTEND_URL}/login`);
    }

    const hash = await jwt.sign({ id }, JWT_SECRET);
    return res.redirect(
      `${FRONTEND_URL}/${FRONTEND_REGISTER_PATH}/${session.shop}/${hash}`
    );
  } catch (error) {
    console.log("/auth/callback error", error);
    return res.send(error);
  }
});

router.get("/set-script", async (req, res) => {
  try {
    const client = new Shopify.Clients.Graphql(SHOP, ACCESS_TOKEN);
    const script = await client.query({
      data: `
        mutation {
          scriptTagCreate(input:{src: "${HOST}/bundle.js", displayScope: ALL}){
            scriptTag{
              src
              displayScope
            } 
          }
        }
      `,
    });
    console.log("script res", script.body);
  } catch (error) {
    console.log("error", error);
  }
});

router.get("/get-scripts", async (req, res) => {
  try {
    const client = new Shopify.Clients.Graphql(SHOP, ACCESS_TOKEN);

    const script = await client.query({
      data: `
      {
        scriptTags(first:100){
          edges{
            node{
               src
               id
            }
          }
        }
      }
      `,
    });
    console.log("script tags", (script.body as any).data.scriptTags.edges);
    res.send((script.body as any).data.scriptTags.edges);
  } catch (error) {
    console.log("error", error);
  }
});

router.post("/delete-script", async (req, res) => {
  try {
    const client = new Shopify.Clients.Graphql(SHOP, ACCESS_TOKEN);
    const script = await client.query({
      data: `
      mutation {
        scriptTagDelete(id: "${req.body.id}"){
          deletedScriptTagId
          userErrors {
            field
            message
          }
        }
      }
      `,
    });

    res.send(script);
  } catch (error) {
    console.log("err", error);
    res.send(error);
  }
});

router.get("/get-session", async (req, res) => {
  const session = await Shopify.Utils.loadCurrentSession(req, res, true);
  console.log("session in get-session", session);
});

export default router;
