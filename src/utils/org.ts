import { MiddlewareFn } from "type-graphql";
import { getConnection } from "typeorm";
import { Athlete } from "../entity/Athlete";
import { Coach } from "../entity/Coach";
import { MyContext } from "../types/MyContext";

export const isInOrg: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.payload) {
    throw new Error("Not authenticated. Can not find Org.");
  }
  try {
    const athlete = await Athlete.findOne({
      where: {
        user: {
          id: context.payload.userId,
        },
      },
    });
    if (athlete) {
      const organization = await getConnection()
        .createQueryBuilder()
        .relation(Athlete, "organization")
        .of(athlete)
        .loadOne();
      context.org = {
        orgId: organization.id,
        role: "athlete",
      };
    }
    if (!athlete) {
      const coach = await Coach.findOne({
        where: {
          user: {
            id: context.payload.userId,
          },
        },
      });
      if (coach) {
        const org = await getConnection()
          .createQueryBuilder()
          .relation(Coach, "organization")
          .of(coach)
          .loadOne();
        context.org = {
          orgId: org.id,
          role: "coach",
        };
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error finding user in org.");
  }
  return next();
};
