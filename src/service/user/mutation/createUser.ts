const createUser = async (args, context) => {
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
