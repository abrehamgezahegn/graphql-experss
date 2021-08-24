module.exports = {
  client: {
    service: {
      name: "storebrew",
      localSchemaFile: "src/admin-schema@2021-01.json",
    },
    includes: ["src/**/*.graphql"],
  },
};
