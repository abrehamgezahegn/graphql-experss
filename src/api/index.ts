import { makeExecutableSchema } from "@graphql-tools/schema";
import { PrismaClient } from "@prisma/client";

import User from "./user/schema";
import userResolver from "./user/resolver";

import service from "../service";

const prisma = new PrismaClient();

const schema = makeExecutableSchema({
  typeDefs: [User],
  resolvers: {
    Query: {
      ...userResolver.Query,
    },
    Mutation: {
      ...userResolver.Mutation,
    },
  },
});

const api = {
  schema,
  context: (req) => ({
    req,
    auth: () => {
      console.log("auth in the graphql context, idk why!");
    },
    prisma,
    service,
  }),
};

export default api;
