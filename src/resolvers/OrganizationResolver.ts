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

  // @FieldResolver()
  // async athletes(@Root() org: Organization) {
  //   const workouts = await getRepository(Athlete).find({
  //     where: { organization: org.id },
  //   });
  //   return workouts;
  // }

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
