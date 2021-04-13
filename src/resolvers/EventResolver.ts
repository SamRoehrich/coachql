import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Event } from "../entity/Event";
import { User } from "../entity/User";
import { MyContext } from "../types/MyContext";
import { isAuth } from "../utils/auth";

@Resolver()
export class EventResolver {
  @Query(() => [Event])
  events() {
    const events = Event.find({ where: { visible: true } });
    return events;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createEvent(
    @Arg("name") name: string,
    @Arg("location") location: string,
    @Arg("visible") visible: boolean,
    @Arg("startDate") startDate: string,
    @Ctx() { payload }: MyContext
  ) {
    try {
      const creator = await User.findOne(payload?.userId);
      await Event.insert({
        name,
        location,
        visible,
        startDate,
        creator,
      });
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }
}
