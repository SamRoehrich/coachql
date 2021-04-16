import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Event } from "../entity/Event";
import { Stack } from "../entity/Stack";
import { MyContext } from "../types/MyContext";
import { isAuth } from "../utils/auth";

@Resolver()
export class StackResolver {
  @Query(() => [Stack])
  getStacks(@Arg("eventId") eventId: string) {
    const stacks = Stack.find({ where: { event: { id: eventId } } });
    return stacks;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createStack(
    @Arg("eventId") eventId: string,
    @Arg("male") male: boolean,
    @Arg("female") female: boolean,
    @Arg("jr") jr: boolean,
    @Arg("a") a: boolean,
    @Arg("b") b: boolean,
    @Arg("c") c: boolean,
    @Arg("d") d: boolean,
    @Ctx() { payload }: MyContext
  ) {
    const event = await Event.findOne({ where: { id: eventId } });
    const creator = await getConnection()
      .createQueryBuilder()
      .relation(Event, "creator")
      .of(event)
      .loadOne();
    event!.creator = creator;
    if (event?.creator.id === payload?.userId) {
      await Stack.insert({
        event,
        a,
        b,
        c,
        d,
        jr,
        male,
        female,
      });
      return true;
    } else {
      return false;
    }
  }
}
