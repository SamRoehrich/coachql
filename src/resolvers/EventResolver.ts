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
import { Boulder } from "../entity/Boulder";
import { RunningOrderResolver } from "./RunningOrderResolver";
@Resolver()
export class EventResolver {
  @Query(() => [Event])
  async events() {
    const events: Event[] = await getConnection().manager.find(Event);
    if (events.length === 0) {
      return events;
    }
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
    if (event) {
      const creator = await getConnection()
        .createQueryBuilder()
        .relation(Event, "creator")
        .of(event)
        .loadOne();
      event.creator = creator;
      const ro = await new RunningOrderResolver().getRunningOrder(
        event.id.toString()
      );
      if (ro) {
        event.runningOrder = ro;
      }

      event.stacks = await getConnection()
        .createQueryBuilder()
        .relation(Event, "stacks")
        .of(event)
        .loadMany();
      let i = 0;
      while (i < event.stacks.length) {
        event.stacks[i].boulders = await Boulder.find({
          where: { stack: event.stacks[i].id },
        });
        i++;
      }
      const athletes: Athlete[] = await getConnection()
        .createQueryBuilder()
        .relation(Event, "athletes")
        .of(event)
        .loadMany();
      if (athletes.length === 0) {
        return event;
      } else {
        const users: User[] = await getConnection()
          .createQueryBuilder()
          .relation(Athlete, "user")
          .of(athletes)
          .loadMany();
        let i = 0;
        while (i < athletes.length) {
          athletes[i].user = users[i];
          i++;
        }
        event.athletes = athletes;
        return event;
      }
    } else {
      return null;
    }
  }

  @Query(() => [Event])
  @UseMiddleware(isAuth)
  async getAuthenticatedEvents(@Ctx() context: MyContext) {
    const user = await User.findOne(context.payload?.userId);
    const events = await this.events();
    if (user && events) {
      const authEvents = events.map((event) => {
        if (event.creator.id === user.id) {
          return event;
        }
        return null;
      });
      console.log(authEvents);
      return authEvents;
    }
    return false;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createEvent(
    @Arg("name") name: string,
    @Arg("location") location: string,
    @Arg("visible") visible: boolean,
    @Arg("startDate") startDate: string,
    @Arg("numBoulders") numBoulders: number,
    @Ctx() ctx: MyContext
  ) {
    try {
      const roResolver = new RunningOrderResolver();
      const creator = await User.findOne(ctx.payload?.userId);
      if (!creator) {
        return false;
      }
      // const newEvent = await Event.insert({
      //   name,
      //   location,
      //   visible,
      //   startDate,
      //   creator,
      //   numBoulders,
      // });
      const newEvent = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Event)
        .values([
          {
            name,
            location,
            visible,
            startDate,
            numBoulders,
            creator,
          },
        ])
        .execute();
      if (newEvent) {
        const eventId = newEvent.identifiers[0].id;
        const res = await roResolver.createRunningOrder(eventId);
        if (res) {
          return true;
        } else {
          return false;
        }
      }
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }

  // @Mutation(() => Boolean)
  // async seedEvent(@Arg("eventId") evnetId: string) {
  //   let i = 0;
  //   const seed = Athletes;
  //   while (i < seed.length) {
  //     let { firstName, lastName, email, password, birthYear, gender } =
  //       seed[i];
  //     await this.registerForEvent(
  //       evnetId,
  //       email,
  //       password,
  //       firstName,
  //       lastName,
  //       birthYear,
  //       gender
  //     );
  //     i++;
  //   }
  //   return true;
  // }

  // @Mutation(() => Boolean)
  // async registerForEvent(
  //   @Arg("eventId") eventId: string,
  //   @Arg("email") email: string,
  //   @Arg("password") password: string,
  //   @Arg("firstName") firstName: string,
  //   @Arg("lastName") lastName: string,
  //   // @Arg("team") team: string,
  //   @Arg("birthYear") birthYear: number,
  //   @Arg("gender") gender: Gender
  // ) {
  //   const userResolver = new UserResolver();
  //   const user = await userResolver.internalLogin(email, password);
  //   if (user) {
  //     const athlete = await Athlete.findOne({ where: { user: user.id } });
  //     if (athlete) {
  //       await getConnection()
  //         .createQueryBuilder()
  //         .relation(Event, "athletes")
  //         .of(eventId)
  //         .add(athlete);
  //       return true;
  //     }
  //   }
  //   await userResolver.register(email, password, firstName, lastName);
  //   const newUser = await User.findOne({ where: { email } });
  //   if (newUser) {
  //     await Athlete.insert({
  //       birthYear,
  //       // team,
  //       user: newUser,
  //       gender,
  //     });
  //     const newAthlete = await Athlete.findOne({ where: { user: newUser.id } });
  //     if (newAthlete) {
  //       // const ageCat = getAgeCatagory(birthYear);
  //       await getConnection()
  //         .createQueryBuilder()
  //         .relation(Event, "athletes")
  //         .of(eventId)
  //         .add(newAthlete);
  //       return true;
  //       //   if (newAthlete.male) {
  //       //     const stacks = await Stack.find({
  //       //       where: { male: true, event: eventId },
  //       //     });
  //       //     for (let x = 0; x < stacks.length; x++) {
  //       //       console.log(stacks[x]);
  //       //       for (const [key, value] of Object.entries(stacks[x])) {
  //       //         if (key === ageCat) {
  //       //           if (value === true) {
  //       //             console.log(key + value + stacks[x].id);
  //       //             await getConnection()
  //       //               .createQueryBuilder()
  //       //               .relation(Stack, "athletes")
  //       //               .of(stacks[x])
  //       //               .add(newAthlete);
  //       //             return true;
  //       //           }
  //       //         }
  //       //       }
  //       //     }
  //       //   } else {
  //       //     const stacks = await Stack.find({ where: { female: true } });
  //       //     for (let x = 0; x < stacks.length; x++) {
  //       //       console.log(stacks[x]);
  //       //       for (const [key, value] of Object.entries(stacks[x])) {
  //       //         if (key === ageCat) {
  //       //           if (value === true) {
  //       //             await getConnection()
  //       //               .createQueryBuilder()
  //       //               .relation(Stack, "athletes")
  //       //               .of(stacks[x])
  //       //               .add(newAthlete);
  //       //             return true;
  //       //           }
  //       //         }
  //       //       }
  //       //     }
  //       //   }
  //       //   return false;
  //     } else return false;
  //   } else return false;
  // }
}
