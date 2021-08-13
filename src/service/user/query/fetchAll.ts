import { Token } from "graphql";

const fetchAll = async (args, ctx) => {
  console.log("inside fetch all", ctx);
  const users = await ctx.prisma.user.findMany();
  console.log("users", users);
  return users;
};

export default fetchAll;

/*

install -> /auth/callback                     -> register with email & pass -> save user to firebase -> get cookie & decrypt hash -> fetch access token from db -> verify store -> save user profile to db 
            -> get access Token
            -> save token + storeinfo + hash 
            -> send hash to frontend as cookie
            

            */
