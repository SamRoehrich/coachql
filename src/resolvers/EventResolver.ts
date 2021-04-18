import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Athlete } from "../entity/Athlete";
import { Event } from "../entity/Event";
import { User } from "../entity/User";
import { MyContext } from "../types/MyContext";
import { isAuth } from "../utils/auth";
import { getConnection } from "typeorm";

@Resolver()
export class EventResolver {
  @Query(() => [Event])
  async events() {
    const events: Event[] = await getConnection().manager.find(Event);
    let i = 0;
    while (i < events.length) {
      const creator = await getConnection()
        .createQueryBuilder()
        .relation(Event, "creator")
        .of(events[i])
        .loadOne();
      if (creator) {
        events[i].creator = creator;
      } else {
        return [];
      }
      i++;
    }
    return events;
  }

  @Query(() => Event)
  async event(@Arg("eventId") eventId: string) {
    const event = await getConnection().manager.findOne(Event, eventId);
    const athletes: Athlete[] = await getConnection()
      .createQueryBuilder()
      .relation(Event, "athletes")
      .of(event)
      .loadMany();
    const users: User[] = await getConnection()
      .createQueryBuilder()
      .relation(Athlete, "user")
      .of(athletes)
      .loadMany();
    const creator = await getConnection()
      .createQueryBuilder()
      .relation(Event, "creator")
      .of(event)
      .loadOne();
    for (let i in athletes) {
      athletes[i].user = users[i];
    }
    event!.athletes = athletes;
    event!.creator = creator;
    return event;
  }

  @Query(() => [Event])
  @UseMiddleware(isAuth)
  async authEvents(@Ctx() context: MyContext) {
    const user = await User.findOne(context.payload?.userId);
    return await Event.find({ where: { creator: user } });
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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async registerAthlete(
    @Arg("evnetId") eventId: string,
    @Ctx() { payload }: MyContext
  ) {
    const athlete = await Athlete.findOne({
      where: { user: { id: payload?.userId } },
    });

    try {
      await getConnection()
        .createQueryBuilder()
        .relation(Event, "athletes")
        .of(eventId)
        .add(athlete);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
