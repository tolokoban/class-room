import FR from "./translation.fr";

const EN: typeof FR = {
  // Generic errors (frontend/src/service/calls/service.ts)
  all1: "Unexpected response format.",

  // user/login
  all10101: "Invalid input.",
  all10102: "Unknown login or wrong password.",

  // class/add
  all20101: "Invalid input.",
  all20102: "This code is already used by another class room.",
  all20103: "Database error while creating the class room.",

  // activity/result-set
  all30101: "Invalid input.",
  all30102: "This class room does not exist.",
  all30103: "This nickname is already used on another computer.",
  all30104: "Database error while storing the result.",

  // activity/result-all
  all30201: "Invalid input.",
  all30202: "This class room does not exist.",
  all30203: "You are not the owner of this class room.",

  // activity/clear
  all30301: "Invalid input.",
  all30302: "This class room does not exist.",
  all30303: "You are not the owner of this class room.",
  all30304: "Database error while deleting the results.",

  // activity/current
  all30401: "Invalid input.",
  all30402: "This class room does not exist.",
};

export default EN;
