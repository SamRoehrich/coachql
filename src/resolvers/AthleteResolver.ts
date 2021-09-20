import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Athlete } from "../entity/Athlete";
import { User } from "../entity/User";
import { Event } from "../entity/Event";
import { isAuth } from "../utils/auth";
import { Organization } from "../entity/Organization";
import { Team } from "../entity/Team";
// import { getAgeCatagory } from "../utils/athlete";
// import { isFemale } from "../utils/stack";

@Resolver(() => Athlete)
export class AthleteResolver {
  @Query(() => [Athlete])
  async athletes() {
    return await Athlete.find();
  }

  @FieldResolver()
  async user(@Root() athlete: Athlete) {
    const user = await getConnection()
      .createQueryBuilder()
      .relation(Athlete, "user")
      .of(athlete)
      .loadOne();
    return user;
  }

  @FieldResolver()
  async organization(@Root() athlete: Athlete) {
    const organization = await getConnection()
      .createQueryBuilder()
      .relation(Athlete, "organization")
      .of(athlete)
      .loadOne();
    return organization;
  }

  @FieldResolver()
  async team(@Root() athlete: Athlete) {
    const team = await getConnection()
      .createQueryBuilder()
      .relation(Athlete, "team")
      .of(athlete)
      .loadOne();
    return team;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async addAthleteToTeam(
    @Arg("athleteId") athleteId: number,
    @Arg("teamId") teamId: number
  ) {
    const athlete = await Athlete.findOne(athleteId);
    const team = await Team.findOne(teamId);

    if (team && athlete) {
      await getConnection()
        .createQueryBuilder()
        .relation(Athlete, "team")
        .of(athlete)
        .set(team);
      return true;
    }
    return false;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteAthleteProfile(@Arg("athleteId") athleteId: number) {
    const athlete = await Athlete.findOne(athleteId);
    if (athlete) {
      const deleteRes = await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Athlete)
        .where("id = :id", { id: athleteId })
        .execute();
      if (deleteRes) {
        return true;
      }
    }
    return false;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateAthleteBirthYear(
    @Arg("athleteId") athleteId: number,
    @Arg("birthYear") birthYear: number
  ) {
    const updateRes = await getConnection()
      .createQueryBuilder()
      .update(Athlete)
      .set({ birthYear })
      .where("id = :id", { id: athleteId })
      .execute();
    if (updateRes) {
      return true;
    }
    return false;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createAthleteProfile(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("email") email: string,
    @Arg("parentEmail") parentEmail: string,
    @Arg("orgId") orgId: number
  ) {
    const organization = await Organization.findOne(orgId);
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
          organization,
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
        organization,
      });
      if (newAthlete) {
        return true;
      }
    }
    return false;
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
