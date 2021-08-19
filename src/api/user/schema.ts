const { gql } = require("apollo-server-express");

const User = gql`
  type Query {
    user(id: ID!): User!
    users: [User]!
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
    createSubscription(data: CreateSubscriptionInput!): Subscription!
  }

  type User {
    id: ID!
    email: String!
    name: String!
    firebaseUserId: String!
  }

  type Subscription {
    id: ID!
    confirmationUrl: String!
  }

  input CreateUserInput {
    email: String!
    name: String!
  }

  input CreateSubscriptionInput {
    plan: Plan!
  }
  enum Plan {
    BASIC
    GOLD
    PLATINUM
  }
`;

export default User;
