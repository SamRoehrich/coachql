import { hash } from "bcryptjs";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { Athlete } from "../entity/Athlete";
import { User } from "../entity/User";
import { Event } from "../entity/Event";
import { Gender } from "../entity/Stack";
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
  async createAthlete(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("birthYear") birthYear: number,
    @Arg("team") team: string,
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
    const athlete = Athlete.insert({ user, birthYear, team, gender });

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
