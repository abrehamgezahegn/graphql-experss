const { gql } = require("apollo-server-express");

const User = gql`
  type Query {
    user(id: ID!): User!
    users: [User]!
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
  }

  type User {
    id: ID!
    email: String!
    name: String!
  }

  input CreateUserInput {
    email: String!
    name: String!
  }
`;

export default User;
