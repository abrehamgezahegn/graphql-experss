const user = (obj, args, context) => {
  return context.service.user.fetchAll(args);
};

const users = (obj, args, context) => {
  console.log("req", context.req.req);
  return context.service.user.fetchAll(args, context);
};

export default { Query: { user, users } };
