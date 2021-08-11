import * as express from "express";
import Shopify, { ApiVersion, AuthQuery } from "@shopify/shopify-api";
import fs from "fs";

const router = express.Router();

const {
  API_KEY,
  API_SECRET_KEY,
  SCOPES,
  FRONTEND_URL,
  FRONTEND_REGISTER_PATH,
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
  console.log("app / called", req.query);
  let authRoute = await Shopify.Auth.beginAuth(
    req,
    res,
    req.query.shop as string,
    "/shopify/auth/callback",
    true
  );
  console.log("auth route", authRoute);
  return res.redirect(authRoute);
});

router.get("/auth/callback", async (req, res) => {
  console.log(
    "merchant is redirected",
    "validating auth callback",
    req.query.shop
  );
  try {
    await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query as unknown as AuthQuery
    );

    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    console.log("session", session);

    // save shop + accesstoken + shopid in db
    fs.writeFile("./access_token.txt", session.accessToken, (err: any) => {
      if (err) {
        console.error(err);
        return;
      }
      //file written successfully
    });
    return res.redirect(
      `${FRONTEND_URL}/${FRONTEND_REGISTER_PATH}/${session.shop}/${session.onlineAccessInfo.associated_user.id}`
    );
    // save shop id as jwt in user localstorage
  } catch (error) {
    console.log("/auth/callback error", error);
    return res.send(error);
  }
});

router.get("/get-session", async (req, res) => {
  const session = await Shopify.Utils.loadCurrentSession(req, res, true);
  console.log("session in get-session", session);
});

export default router;
