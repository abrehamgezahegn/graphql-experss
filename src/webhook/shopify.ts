import * as express from "express";
import Shopify, { ApiVersion, AuthQuery } from "@shopify/shopify-api";
import { PrismaClient } from "@prisma/client";

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
  console.log("auth callback called");
  try {
    await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query as unknown as AuthQuery
    );

    const session = await Shopify.Utils.loadOfflineSession(
      req.query.shop as string
    );

    (req as any).session.shopifySessionId = session.id;

    try {
      const shopifySession = await prisma.storeSession.upsert({
        where: {
          id: session.id,
        },
        update: {
          shop: session.shop,
          accessToken: session.accessToken,
        },
        create: {
          shop: session.shop,
          id: session.id,
          accessToken: session.accessToken,
        },
      });
      console.log("shopify session prisma", shopifySession);
    } catch (error) {
      console.log("create store session error", error);
    }

    console.log("settting cookieee");
    res.cookie("shopify_session", "shaaattaaaa_this_is_the_access_token", {
      domain: `${FRONTEND_URL}/${FRONTEND_REGISTER_PATH}/${session.shop}/${session.id}`,
      maxAge: 900000,
      httpOnly: false,
      secure: false,
      sameSite: false,
    });

    console.log("setting session");
    (req as any).session.shopify_session_id = session.id;

    console.log("redirecting");
    return res.redirect(
      `${FRONTEND_URL}/${FRONTEND_REGISTER_PATH}/${session.shop}/${session.id}`
    );
    // save shop id as jwt in user localstorage
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
  console.log("req body delete script: ", req.body);
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

    console.log("delted script", script);
    res.send(script);
  } catch (error) {
    console.log("err", error);
    res.send(error);
  }
});

router.get("/get-cookie", async (req, res) => {
  res.cookie("shopify_session", "shaaattaaaa_this_is_the_access_token", {
    // domain: FRONTEND_URL,
    maxAge: 900000000,
    httpOnly: false,
    secure: false,
  });
  res.send("cookie set");
});

router.get("/get-session", async (req, res) => {
  const session = await Shopify.Utils.loadCurrentSession(req, res, true);
  console.log("session in get-session", session);
});

export default router;
