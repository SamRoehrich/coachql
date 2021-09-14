import { hash } from "bcryptjs";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { Athlete } from "../entity/Athlete";
import { User } from "../entity/User";
import { Event } from "../entity/Event";
import { Gender } from "../entity/Stack";
import { isAuth } from "../utils/auth";
// import { getAgeCatagory } from "../utils/athlete";
// import { isFemale } from "../utils/stack";

@Resolver()
export class AthleteResolver {
  @Query(() => [Athlete])
  async athletes(@Arg("eventId") eventId: string) {
    const event = await Event.findOne(eventId);
    const athletes = await getConnection()
      .createQueryBuilder()
      .relation(Athlete, "user")
      .of(event)
      .loadMany();
    return athletes;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createAthleteProfile(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("email") email: string,
    @Arg("parentEmail") parentEmail: string,
    @Arg("team") team: string
  ) {
    const exisdtingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (exisdtingUser) {
      const athleteProfile = await Athlete.findOne({
        where: { user: exisdtingUser },
      });
      if (athleteProfile) {
        return false;
      }
    }
    const newUser = await User.insert({
      email,
      firstName,
      lastName,
    });
    console.log(newUser);
    console.log(parentEmail, team);
    return true;
  }

  @Mutation(() => Boolean)
  async createAthlete(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("birthYear") birthYear: number,
    // @Arg("team") team: string,
    @Arg("gender") gender: Gender
  ) {
    const hashedPassword = await hash(password, 12);
    await User.insert({
      lastName,
      firstName,
      email,
      password: hashedPassword,
    });

    const user = await User.findOne({ where: { email } });
    const athlete = await Athlete.insert({ user, birthYear, gender });

    if (athlete) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async addAthleteToEvent(
    @Arg("athleteId") athleteId: string,
    @Arg("eventId") eventId: string
  ) {
    const event = await getConnection().manager.findOne(Event, eventId);
    const athlete = await getConnection().manager.findOne(Athlete, athleteId);
    if (event && athlete) {
      // await getConnection()
      //   .createQueryBuilder()
      //   .relation(Event, "athletes")
      //   .of(event)
      //   .add(athlete);
      event.stacks = await getConnection()
        .createQueryBuilder()
        .relation(Event, "stacks")
        .of(event)
        .loadMany();
      // TODO: Add Athlete To Stack
      // const catagory = getAgeCatagory(athlete.birthYear);
      // //female
      // if (athlete.female) {

      // }
    } else {
      return false;
    }
    return true;
  }
}
