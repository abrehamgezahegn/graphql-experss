const fetchAll = async (args, ctx) => {
  const users = await ctx.prisma.user.findMany();
  return users;
};

export default fetchAll;
