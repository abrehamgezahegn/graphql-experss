import jwt from "jsonwebtoken";

const createUser = async (args, context) => {
  const tokens = context.req.req.headers.authorization
    .split("Bearer ")[1]
    .split("SEPARATOR ");
  const sessionIdHash = tokens[1];

  const decodedSessionId = jwt.verify(sessionIdHash, process.env.JWT_SECRET);

  const store = await context.prisma.storeSession.findUnique({
    where: {
      id: (decodedSessionId as any).id,
    },
  });

  console.log("store", store);

  const firebaseUserId = context.req.req.userUid;
  return await context.prisma.user.create({
    data: {
      email: args.data.email,
      name: args.data.name,
      firebaseUserId,
      storeId: store.shopId,
    },
  });
};

export default createUser;
