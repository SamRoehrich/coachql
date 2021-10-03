import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import { createConnection } from "typeorm";
import cors from "cors";
import { EventResolver } from "./resolvers/EventResolver";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import {
  createAccessToken,
  createRefreshToken,
  revokeRefreshTokenForUser,
  sendRefreshToken,
} from "./utils/auth";
import { TeamResolver } from "./resolvers/TeamResolver";
import { AthleteResolver } from "./resolvers/AthleteResolver";
import { StackResolver } from "./resolvers/StackResolver";
import { BoulderResolver } from "./resolvers/BoulderResolver";
import { RunningOrderResolver } from "./resolvers/RunningOrderResolver";
import { WorkoutResolver } from "./resolvers/WorkoutsResolver";
import { OrganizationResolver } from "./resolvers/OrganizationResolver";
import { CoachResolver } from "./resolvers/CoachResolver";
import { SessionResolver } from "./resolvers/SessionResolver";

(async () => {
  const app = express();
  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  app.get("/", (_, res) => res.send("Navigate to /graphql."));

  app.post("/refresh_mobile_token", async (req, res) => {
    const authorization = req.headers.authorization;
    console.log(authorization);
    if (!authorization) {
      res.send({ ok: false, accessToken: "" });
    }

    let payload: any = null;

    if (authorization) {
      try {
        const token = authorization.split(" ")[1];
        console.log("token" + token);
        payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      } catch (err) {
        console.log(err);
        return false;
      }

      console.log(payload);

      const user = await User.findOne({ id: payload.userId });
      if (!user) {
        console.log("no user");
        return res.send({ ok: false, accessToken: "" });
      }
      sendRefreshToken(res, createRefreshToken(user));
      return res.send({ ok: true, accessToken: createAccessToken(user) });
    } else {
      return res.send({ ok: false, accessToken: "dsafasdfds" });
    }
  });

  app.post("/refresh_token", async (req, res) => {
    console.log("refresh called");
    console.log(req.cookies);
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return false;
    }

    const user = await User.findOne({ id: payload.userId });
    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }
    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }
    sendRefreshToken(res, createRefreshToken(user));
    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  app.post("/revoke", async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return false;
    }
    const user = await User.findOne({ id: payload.userId });
    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }
    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }
    return res.send(await revokeRefreshTokenForUser(user));
  });

  // await createConnection({
  //   type: "postgres",
  //   host: process.env.REMOTE_DB_HOST,
  //   database: process.env.REMOTE_DB_DATABASE,
  //   port: 5432,
  //   username: process.env.REMOTE_DB_USER,
  //   password: process.env.REMOTE_DB_PASSWORD,
  //   extra: {
  //     ssl: {
  //       rejectUnauthorized: false,
  //     },
  //   },
  //   synchronize: true,
  //   logging: true,
  //   entities: ["src/entity/**/*.ts"],
  //   migrations: ["src/migration/**/*.ts"],
  //   subscribers: ["src/subscriber/**/*.ts"],
  //   cli: {
  //     entitiesDir: "src/entity",
  //     migrationsDir: "src/migration",
  //     subscribersDir: "src/subscriber",
  //   },
  // });

  await createConnection({
    type: "postgres",
    host: "ec2-44-195-201-3.compute-1.amazonaws.com",
    port: 5432,
    username: "idktswroxxygzz",
    password:
      "5d3d800fe23125d3fd329c87f829384f78f100e8f576824d42d2ad5cab057a94",
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    database: "dfe6qj9uto43fu",
    synchronize: true,
    logging: true,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber",
    },
  });

  // LAPTOP CONFIG

  // await createConnection({
  //   type: "postgres",
  //   host: "localhost",
  //   port: 5432,
  //   username: "postgres",
  //   password: "postgres",
  //   database: "coachql",
  //   synchronize: true,
  //   logging: true,
  //   entities: ["src/entity/**/*.ts"],
  //   migrations: ["src/migration/**/*.ts"],
  //   subscribers: ["src/subscriber/**/*.ts"],
  //   cli: {
  //     entitiesDir: "src/entity",
  //     migrationsDir: "src/migration",
  //     subscribersDir: "src/subscriber",
  //   },
  // });

  const apolloServer = new ApolloServer({
    tracing: true,
    introspection: true,
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        EventResolver,
        TeamResolver,
        AthleteResolver,
        StackResolver,
        BoulderResolver,
        RunningOrderResolver,
        WorkoutResolver,
        OrganizationResolver,
        CoachResolver,
        SessionResolver,
      ],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(process.env.PORT || 4000, () => {
    console.log("Server running @ http://loaclhost:4000/graphql");
  });
})();
