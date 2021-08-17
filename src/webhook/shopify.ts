import * as express from "express";
import Shopify, { ApiVersion, AuthQuery } from "@shopify/shopify-api";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = express.Router();

const {
  API_KEY,
  API_SECRET_KEY,
  SCOPES,
  FRONTEND_URL,
  FRONTEND_REGISTER_PATH,
  SHOP,
  COOKIE_NAME,
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

    console.log("session", session);

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

    return res.redirect(
      `${FRONTEND_URL}/${FRONTEND_REGISTER_PATH}/${session.shop}/${session.id}`
    );
    // save shop id as jwt in user localstorage
  } catch (error) {
    console.log("/auth/callback error", error);
    return res.send(error);
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
