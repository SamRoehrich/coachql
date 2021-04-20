// import { Athlete } from "../entity/Athlete";

export const getAgeCatagory = (birthYear: number) => {
  switch (birthYear) {
    case 2010:
      return "d";
    case 2009:
      return "c";
    case 2008:
      return "c";
    case 2007:
      return "b";
    case 2006:
      return "b";
    case 2005:
      return "a";
    case 2004:
      return "a";
    case 2003:
      return "jr";
    case 2002:
      return "jr";
    default:
      return "d";
  }
};
