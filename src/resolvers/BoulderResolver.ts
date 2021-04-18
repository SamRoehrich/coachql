import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Boulder } from "../entity/Boulder";
import { isAuth } from "../utils/auth";

@Resolver()
export class BoulderResolver {
  @Query(() => [Boulder])
  async getBoulders() {
    return await Boulder.find();
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async createBoulder(
    @Arg("stackId") stackId: number,
    @Arg("boulderNumber") boulderNumber: number
  ) {
    const boulder = await Boulder.insert({
      boulderNumber,
      stackId,
    });
    if (boulder) {
      return true;
    } else {
      return false;
    }
  }
}
