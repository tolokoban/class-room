import {
  activityClear,
  activityCurrent,
  activityCurrentSet,
  activityResultAll,
  activityResultSet,
} from "./activity";
import { classAdd, classDelete, classList, classUpdate } from "./class";
import { fileAdd, fileDelete, fileList, fileNotesGet, fileNotesSet, fileReplace } from "./file";
import { roomCheck, roomEnter, roomKick, roomSeats, roomStudents } from "./room";
import { userLogin, userLogout } from "./user";
import {
  writtenAdd,
  writtenAssign,
  writtenClassroom,
  writtenDelete,
  writtenFilesDelete,
  writtenList,
  writtenResults,
  writtenState,
  writtenTimer,
  writtenUnassign,
  writtenUpdate,
  writtenUpload,
  writtenUploadContent,
  writtenUploadDelete,
} from "./written";

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
    update: classUpdate,
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
    check: roomCheck,
    enter: roomEnter,
    kick: roomKick,
    seats: roomSeats,
    students: roomStudents,
  },
  user: {
    login: userLogin,
    logout: userLogout,
  },
  written: {
    add: writtenAdd,
    assign: writtenAssign,
    classroom: writtenClassroom,
    delete: writtenDelete,
    filesDelete: writtenFilesDelete,
    list: writtenList,
    results: writtenResults,
    state: writtenState,
    timer: writtenTimer,
    unassign: writtenUnassign,
    update: writtenUpdate,
    upload: writtenUpload,
    uploadDelete: writtenUploadDelete,
    uploadContent: writtenUploadContent,
  },
};
