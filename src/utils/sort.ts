import { Athlete } from "../entity/Athlete";

export function compare(a: Athlete, b: Athlete) {
  if (a.user.lastName < b.user.lastName) {
    return -1;
  }
  if (a.user.lastName > b.user.lastName) {
    return 1;
  }
  return 0;
}
