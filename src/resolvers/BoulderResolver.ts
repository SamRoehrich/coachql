import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Boulder } from "../entity/Boulder";
import { isAuth } from "../utils/auth";
import { getConnection } from "typeorm";

@Resolver()
export class BoulderResolver {
  @Query(() => [Boulder])
  async getBoulders() {
    return await Boulder.find();
  }

  @Query(() => Boulder)
  async getBoulder(@Arg("boulderId") boulderId: number) {
    const boulder = await getConnection().manager.findOne(Boulder, boulderId);
    const stack = await getConnection()
      .createQueryBuilder()
      .relation(Boulder, "stack")
      .of(boulder)
      .loadOne();

    if (boulder) {
      boulder.stack = stack!;
      return boulder;
    } else {
      return null;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async createBoulder(
    @Arg("stackId") stack: number,
    @Arg("boulderNumber") boulderNumber: number
  ) {
    const boulder = Boulder.insert({ stack, boulderNumber });
    if (boulder) {
      return true;
    } else {
      return false;
    }
  }
}
