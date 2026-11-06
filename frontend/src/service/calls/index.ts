import {
  activityClear,
  activityCurrent,
  activityCurrentSet,
  activityResultAll,
  activityResultSet,
} from "./activity";
import { classAdd, classDelete, classList } from "./class";
import { fileAdd, fileDelete, fileList, fileNotesGet, fileNotesSet, fileReplace } from "./file";
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
  file: {
    add: fileAdd,
    delete: fileDelete,
    list: fileList,
    notesGet: fileNotesGet,
    notesSet: fileNotesSet,
    replace: fileReplace,
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
