const createUser = async (args, context) => {
  console.log("create user ", context.req.req.userUid);
  const firebaseUserId = context.req.req.userUid;
  return await context.prisma.user.create({
    data: {
      email: args.data.email,
      name: args.data.name,
      firebaseUserId,
    },
  });
};

export default createUser;
