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

@Resolver(() => Athlete)
export class AthleteResolver {
  @Query(() => [Athlete])
  async athletes() {
    return await Athlete.find();
  }

  // Fix FIRST

  // @FieldResolver()
  // async user(@Root() athlete: Athlete) {
  //   console.log(athlete);
  //   const user = await getRepository(User).findOne({
  //     where: { id: athlete.user },
  //   });
  //   console.log(user);
  //   return user;
  // }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createAthleteProfile(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("email") email: string,
    @Arg("parentEmail") parentEmail: string
  ) {
    //check if user already exists
    const exisdtingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (exisdtingUser) {
      // check if there is an existing athlete profile
      const athleteProfile = await Athlete.findOne({
        where: { user: exisdtingUser },
      });
      if (athleteProfile) {
        return false;
      }
      if (athleteProfile === undefined) {
        // no profile? ok. create one
        const newAthlete = await Athlete.insert({
          user: exisdtingUser,
          parentEmail,
        });
        if (newAthlete) {
          return true;
        }
      }
      console.log("user exists but can not be added to an athlete profile.");
      return false;
    }
    const newUser = await User.insert({
      email,
      firstName,
      lastName,
    });
    if (newUser) {
      const user = await User.findOne(newUser.identifiers[0].id);
      const newAthlete = await Athlete.insert({
        parentEmail,
        user,
      });
      if (newAthlete) {
        return true;
      }
    }
    return false;
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
