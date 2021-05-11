import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { Event } from "../entity/Event";
// import { Group } from "../entity/Group";
import { RunningOrder } from "../entity/RunningOrder";
import { InitialStacks, Stack } from "../entity/Stack";

@Resolver()
export class RunningOrderResolver {
  @Mutation(() => Boolean)
  async createRunningOrder(@Arg("eventId") eventId: string) {
    console.log(eventId);
    const qb = getConnection().createQueryBuilder();
    const unordered = await qb
      .insert()
      .into(Stack)
      .values(InitialStacks)
      .execute();
    // attach event to stack
    for (let stack of unordered.identifiers) {
      await qb.relation(Stack, "event").of(stack).set(eventId);
    }
    //add stacks to running order
    const ro = await qb
      .insert()
      .into(RunningOrder)
      .values({ unordered: unordered.identifiers })
      .execute();

    await qb
      .relation(Event, "runningOrder")
      .of(eventId)
      .set(ro.identifiers[0].id);
    return true;
  }

  @Query(() => RunningOrder)
  async getRunningOrder(@Arg("eventId") eventId: string) {
    const qb = getConnection().createQueryBuilder();
    let ro = await qb.relation(Event, "runningOrder").of(eventId).loadOne();
    if (ro) {
      for (let i = 0; i < ro.unordered.length; i++) {
        const stack = await getConnection()
          .createQueryBuilder()
          .where("stack.id = :stackId", { stackId: ro.unordered[i].id })
          .getOne();
        ro.unordered[i] = stack;
      }
      return ro;
    }
    return null;
  }
}
