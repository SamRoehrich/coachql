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
import { getConnection, getRepository } from "typeorm";
import { Workout } from "../entity/Workout";
import { Athlete } from "../entity/Athlete";
import { Team } from "../entity/Team";
import { Coach } from "../entity/Coach";
import { isInOrg } from "../utils/org";
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

  @FieldResolver()
  async coaches(@Root() org: Organization) {
    const coaches = await getRepository(Coach).find({
      where: { organization: org.id },
    });
    return coaches;
  }

  @Query(() => [Organization])
  async getOrganizations() {
    return await Organization.find();
  }

  @Query(() => [Athlete])
  @UseMiddleware(isAuth)
  async getAthletesInOrg(@Ctx() context: MyContext) {
    const org: Organization = await this.getOrganization(context);
    const athletes = await getRepository(Athlete)
      .createQueryBuilder("athlete")
      .where("athlete.organizationId = :orgId", { orgId: org.id })
      .getMany();
    if (athletes.length > 0) {
      for (let athlete of athletes) {
        const user = await getConnection()
          .createQueryBuilder()
          .relation(Athlete, "user")
          .of(athlete)
          .loadOne();
        if (user) {
          athlete.user = user;
        }
      }
      let sorted = [...athletes];
      sorted.sort((a, b) => a.user.lastName.localeCompare(b.user.lastName));
      return sorted;
    } else {
      return null;
    }
  }

  @Query(() => [Workout])
  @UseMiddleware(isAuth)
  @UseMiddleware(isInOrg)
  async getWorkoutsInOrg(@Ctx() context: MyContext) {
    const workouts = await Workout.find({
      where: {
        organization: {
          id: context.org?.orgId,
        },
      },
    });
    if (workouts) {
      return workouts;
    }
    return null;
  }

  @Query(() => [Team])
  @UseMiddleware(isAuth)
  async getTeamsInOrg(@Ctx() context: MyContext) {
    const org = await this.getOrganization(context);
    const teams = await Team.find({
      where: {
        organization: {
          id: org.id,
        },
      },
    });
    return teams;
  }

  @Query(() => Organization)
  @UseMiddleware(isAuth)
  async getOrganization(@Ctx() { payload }: MyContext) {
    const coach = await Coach.findOne({
      where: {
        user: {
          id: payload!.userId,
        },
      },
    });
    console.log(coach);

    const org = await getConnection()
      .createQueryBuilder()
      .relation(Coach, "organization")
      .of(coach)
      .loadOne();
    return org;
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
