import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Event } from "../entity/Event";

@Resolver()
export class EventResolver {
  @Query(() => [Event])
  events() {
    const events = Event.find({ where: { visible: true } });
    return events;
  }

  @Mutation(() => Boolean)
  async createEvent(
    @Arg("name") name: string,
    @Arg("location") location: string,
    @Arg("visible") visible: boolean
  ) {
    try {
      await Event.insert({
        name,
        location,
        visible,
      });
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }
}
