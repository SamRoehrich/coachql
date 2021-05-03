import { sign, verify } from "jsonwebtoken";
import { Middleware } from "type-graphql/dist/interfaces/Middleware";
import { User } from "../entity/User";
import { MyContext } from "../types/MyContext";
import { Response } from "express";
import { getConnection } from "typeorm";

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "5d",
  });
};

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};

export const isAuth: Middleware<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    context.payload = { userId: 0, success: false };
  }

  try {
    const token = authorization?.split(" ")[1];
    if (token === undefined) return next();
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload!.userId = payload as any;
    context.payload!.success = true;
  } catch (err) {
    console.log(err);
  }
  return next();
};

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("jid", token, {
    httpOnly: true,
    path: "/refresh_token",
  });
};

export const revokeRefreshTokenForUser = async (user: User) => {
  await getConnection()
    .getRepository(User)
    .increment({ id: user.id }, "tokenVersion", 1);

  return true;
};
