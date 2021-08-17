const fetchAll = async (args, ctx) => {
  const users = await ctx.prisma.user.findMany();
  console.log("usesrs", users);
  return users;
};

export default fetchAll;
