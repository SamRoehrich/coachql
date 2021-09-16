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
import { Organization } from "../entity/Organization";
import { User } from "../entity/User";
import { MyContext } from "../types/MyContext";
import { isAuth } from "../utils/auth";
import { getRepository } from "typeorm";
import { Workout } from "../entity/Workout";
import { Athlete } from "../entity/Athlete";
import { Team } from "../entity/Team";
// import { Athlete } from "../entity/Athlete";

@Resolver(() => Organization)
export class OrganizationResolver {
  @FieldResolver()
  async workouts(@Root() org: Organization) {
    const workouts = await getRepository(Workout).find({
      where: { organization: org.id },
    });
    return workouts;
  }

  @FieldResolver()
  @UseMiddleware(isAuth)
  async owner(@Ctx() { payload }: MyContext) {
    const owner = await User.findOne(payload?.userId);
    return owner;
  }

  @FieldResolver()
  async teams(@Root() org: Organization) {
    const teams = await getRepository(Team).find({
      where: { organization: org.id },
    });
    return teams;
  }

  @FieldResolver()
  async athletes(@Root() org: Organization) {
    const athletes = await getRepository(Athlete).find({
      where: { organization: org.id },
    });
    return athletes;
  }

  @Query(() => [Organization])
  async getOrganizations() {
    return await Organization.find();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createOrganization(
    @Arg("name") name: string,
    @Ctx() { payload }: MyContext
  ) {
    const user = await User.findOne(payload?.userId);
    if (user) {
      const newOrg = await Organization.insert({
        name,
        owner: user,
      });
      if (newOrg) {
        return true;
      }
    }
    return false;
  }
}
