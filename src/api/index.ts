import { makeExecutableSchema } from "@graphql-tools/schema";

import User from "./user/schema";
import userResolver from "./user/resolver";

const schema = makeExecutableSchema({
  typeDefs: [User],
  resolvers: {
    Query: {
      ...userResolver.Query,
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
  }),
};

export default api;
