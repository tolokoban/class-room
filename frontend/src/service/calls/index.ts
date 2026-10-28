import {
  activityClear,
  activityCurrent,
  activityCurrentSet,
  activityResultAll,
  activityResultSet,
} from "./activity";
import { classAdd, classList } from "./class";
import { userLogin, userLogout } from "./user";

export const API = {
  activity: {
    clear: activityClear,
    current: activityCurrent,
    currentSet: activityCurrentSet,
    resultAll: activityResultAll,
    resultSet: activityResultSet,
  },
  class: {
    add: classAdd,
    list: classList,
  },
  user: {
    login: userLogin,
    logout: userLogout,
  },
};
