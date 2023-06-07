require("dotenv").config();
import "reflect-metadata";

import { DataSource } from "typeorm";
import { User } from "./entities/User";
import express from "express";

import { createServer } from "http";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { GreetingResolver } from "./resolvers/greeting";
import { UserResolver } from "./resolvers/user";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";

const AppDataSource = async () => {
  new DataSource({
    type: "postgres",
    database: "jwt-auth-tut",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: true,
    synchronize: true,
    entities: [User],
  });
  const app = express();

  const httpServer = createServer(app);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      validate: false,
      resolvers: [GreetingResolver ],
    }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground,
    ],
  });

  const PORT = process.env.PORT || 4000;

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  new Promise((res) => httpServer.listen({ port: PORT }, res as () => void));

  // Typically, http://localhost:4000/graphql
  console.log(
    `SERVER STARTED ON PORT ${PORT}. GRAPHQL ENDPOINT ON http://localhost:${PORT}${apolloServer.graphqlPath}`
  );
};

AppDataSource().catch((error) => console.log("ERROR STARTING SERVER: ", error));
