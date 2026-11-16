import FR from "./translation.fr";

const EN: typeof FR = {
  titleNew: "New written production",
  titleEdit: 'Edit "$1"',
  name: "Name",
  duration: "Duration of the exercise (minutes)",
  expiration: "Deletion of the files (hours after the end)",
  description: "Instructions (Markdown)",
  edit: "Edit",
  view: "Preview",
  placeholder: "Describe what the students must produce...",
  files: "Expected files",
  filesHint:
    'The name of an expected file is part of the name of the downloaded files: "nickname.name.xxxxxx.ext".',
  addFile: "Add an expected file",
  save: "Save",
  delete: "Delete",
  saved: 'The written production "$1" has been saved.',
  deleteConfirm:
    'Permanently delete "$1"? It will be removed from all the class rooms and all the files uploaded by the students will be deleted.',
  deleted: 'The written production "$1" has been deleted.',
  filesChangedConfirm:
    "You have removed or renamed expected files. The $1 file(s) already uploaded by the students for them will be permanently deleted. Continue?",
  errorName: "Please enter a name.",
  errorNoFile: "At least one expected file is needed.",
  errorFileName:
    'Invalid expected file name: "$1". It must not start with a dot nor contain / \\ : * ? " < > |',
  errorFileDuplicate: 'Two expected files have the same name: "$1".',
};

export default EN;
