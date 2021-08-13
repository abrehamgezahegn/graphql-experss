const user = (obj, args, context) => {
  return context.service.user.fetchAll(args);
};

const users = (obj, args, context) => {
  return context.service.user.fetchAll(args, context);
};

export default { Query: { user, users } };
