const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');
const path = require('path');

const { PrismaClient } = require('@prisma/client');
const { getUserId } = require('./src/utils');
const Query = require('./src/resolvers/Query');
const Mutation = require('./src/resolvers/Mutation');
const Link = require('./src/resolvers/Link');
const User = require('./src/resolvers/User');

const prisma = new PrismaClient();


const resolvers = {
  Query,
  Mutation,
  Link,
  User,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "src", "schema.graphql"), "utf-8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    }
  }
});

server.listen()
  .then(({ url }) => console.log(`${url}サーバー起動`));