const user = (obj, args, context) => {
  return context.service.user.fetchAll(args);
};

const users = (obj, args, context) => {
  return context.service.user.fetchAll(args, context);
};

const createUser = (obj, args, context) => {
  return context.service.user.createUser(args, context);
};

const createSubscription = (obj, args, context) => {
  return context.service.user.createSubscription(args, context);
};

export default {
  Query: { user, users },
  Mutation: { createUser, createSubscription },
};
