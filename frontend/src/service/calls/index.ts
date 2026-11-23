import {
  activityClear,
  activityCurrent,
  activityCurrentSet,
  activityResultAll,
  activityResultGet,
  activityResultSet,
} from "./activity";
import { classAdd, classDelete, classList, classUpdate } from "./class";
import { fileDelete, fileList, fileNotesGet, fileNotesSet, fileUpload } from "./file";
import { roomCheck, roomEnter, roomKick, roomSeats, roomStudents } from "./room";
import { userLogin, userLogout } from "./user";
import {
  writtenAdd,
  writtenAssign,
  writtenAttachmentDelete,
  writtenAttachmentUpload,
  writtenClassroom,
  writtenDelete,
  writtenFilesDelete,
  writtenList,
  writtenReorder,
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
    resultGet: activityResultGet,
    resultSet: activityResultSet,
  },
  class: {
    add: classAdd,
    delete: classDelete,
    list: classList,
    update: classUpdate,
  },
  file: {
    delete: fileDelete,
    list: fileList,
    notesGet: fileNotesGet,
    notesSet: fileNotesSet,
    upload: fileUpload,
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
    attachmentDelete: writtenAttachmentDelete,
    attachmentUpload: writtenAttachmentUpload,
    classroom: writtenClassroom,
    delete: writtenDelete,
    filesDelete: writtenFilesDelete,
    list: writtenList,
    reorder: writtenReorder,
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
