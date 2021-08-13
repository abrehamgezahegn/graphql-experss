// import services from "../services";
// import model from "../database/models";
// import utils from "../utils";
import { Request } from "express";

export type context = {
  req: Request;
  // model: typeof model;
  // utils: typeof utils;
  // services: typeof services;
  auth: () => {};
};
