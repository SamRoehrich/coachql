import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entity/User";
import { MyContext } from "../types/MyContext";
import { isAuth } from "../utils/auth";
import { verify } from "jsonwebtoken";
import { Team } from "../entity/Team";
import { getConnection, getRepository } from "typeorm";
import { Workout } from "../entity/Workout";

@Resolver(() => Team)
export class TeamResolver {
  @Query(() => [Team])
  async teams() {
    return await Team.find();
  }

  @Query(() => Team)
  async getTeamByCoachId(@Arg("coachId") coachId: string) {
    const team = await getRepository(Team).findOne({
      where: { headCoach: coachId },
    });
    if (team) {
      return team;
    }
    return null;
  }

  @FieldResolver()
  async headCoach(@Root() team: Team) {
    const headCoach = await getConnection()
      .createQueryBuilder()
      .relation(Team, "headCoach")
      .of(team)
      .loadOne();
    return headCoach;
  }

  @FieldResolver()
  async workouts(@Root() team: Team) {
    const workouts = await getRepository(Workout).find({
      where: { team: team.id },
    });
    return workouts;
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
