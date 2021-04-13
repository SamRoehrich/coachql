import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entity/User";
import { MyContext } from "../types/MyContext";
import { isAuth } from "../utils/auth";
import { verify } from "jsonwebtoken";
import { Team } from "../entity/Team";

@Resolver()
export class TeamResolver {
  @Query(() => [Team])
  teams() {
    return Team.find();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async registerTeam(
    @Arg("teamName") teamName: string,
    @Ctx() context: MyContext
  ) {
    try {
      const authorization = context.req.headers["authorization"];
      if (!authorization) return false;
      const token = authorization.split(" ")[1];
      if (token === undefined) return false;
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      const user = await User.findOne(payload.userId);
      if (user) {
        await Team.insert({
          teamName,
          headCoach: user,
        });
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return true;
  }
}
