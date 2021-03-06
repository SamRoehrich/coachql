import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
  FieldResolver,
  Root,
} from "type-graphql";
import { MyContext } from "../types/MyContext";
import { isAuth } from "../utils/auth";
import { Team } from "../entity/Team";
import { getRepository, getManager } from "typeorm";
import { Organization } from "../entity/Organization";
import { Athlete } from "../entity/Athlete";
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
  @UseMiddleware(isAuth)
  async organization(@Ctx() { payload }: MyContext) {
    const org = await getRepository(Organization).findOne({
      where: { owner: payload?.userId },
    });
    return org;
  }

  @FieldResolver()
  async athletes(@Root() team: Team) {
    const athletes = await getRepository(Athlete).find({
      where: { team: team.id },
    });
    return athletes;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createTeam(
    @Arg("teamName") teamName: string,
    @Arg("orgId") orgId: number
  ) {
    const org = await Organization.findOne(orgId);
    const newTeam = await Team.insert({
      teamName,
      organization: org,
    });
    if (newTeam) {
      return true;
    }

    return false;
  }

  @Mutation(() => Boolean)
  async deleteTeam(@Arg("teamId") teamId: number) {
    const manager = getManager();
    const team = await Team.findOne(teamId);
    await manager.remove(team);
    return true;
  }
}
