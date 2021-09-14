import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Coach } from "../entity/Coach";
import { Organization } from "../entity/Organization";
import { User } from "../entity/User";
import { MyContext } from "../types/MyContext";
import { isAuth } from "../utils/auth";

@Resolver()
export class CoachResolver {
  @Query(() => [Coach])
  async getCoaches() {
    return await Coach.find();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createCoachProfile(
    @Arg("orgId") orgId: number,
    @Arg("birthYear") birthYear: number,
    @Ctx() { payload }: MyContext
  ) {
    try {
      const organization = await Organization.findOne(orgId);
      const user = await User.findOne(payload?.userId);
      const newCoach = await Coach.insert({
        birthYear,
        organization,
        user,
      });
      if (newCoach) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
