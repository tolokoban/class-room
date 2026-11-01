import {
  activityClear,
  activityCurrent,
  activityCurrentSet,
  activityResultAll,
  activityResultSet,
} from "./activity";
import { classAdd, classDelete, classList } from "./class";
import { roomEnter, roomStudents } from "./room";
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
    delete: classDelete,
    list: classList,
  },
  room: {
    enter: roomEnter,
    students: roomStudents,
  },
  user: {
    login: userLogin,
    logout: userLogout,
  },
};
