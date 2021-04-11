import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { User } from "../entity/User";
import { MyContext } from "../types/MyContext";
import {
  createAccessToken,
  createRefreshToken,
  isAuth,
  sendRefreshToken,
} from "../utils/auth";
import { verify } from "jsonwebtoken";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field(() => User)
  user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi!";
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  me(@Ctx() context: MyContext) {
    const authorization = context.req.headers["authorization"];

    if (!authorization) return null;

    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      const user = User.findOne(payload.userId);
      return user;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    console.log(payload);
    return "your user id is: " + payload?.userId;
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string
  ) {
    const hashedPassword = await hash(password, 12);

    try {
      await User.insert({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() context: MyContext) {
    sendRefreshToken(context.res, "");
    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Invalid login: User not found");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("Invalid Password");
    }

    //login successful
    sendRefreshToken(res, createRefreshToken(user));
    return {
      accessToken: createAccessToken(user),
      user,
    };
  }
}
