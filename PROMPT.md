I want the teacher to be able to store files in each classroom.
We need a new database table `classroom_files` with this fields:

- An auto incremental ID
- The name of the file (with the extension, but without any folder)
- The size of the file in bytes
- The mime type
- A link to the classroom it belongs

The files will be stored in `/files`, a folder that is protected from direct access with a `.htaccess` file.
To prevent having too much files in one folder, we will use subfolder based on the unique ID of each file.
The rule si that we don't have more than 100 files and 100 folder per folder.

Let's take an example.

- A teacher uploads the file `my-slides.odp`.
- It is stored in the database and get the id `47211`.
- It will then be stored in `/files/04/72/11.odp`.

We wil need new entrypoints :

- `file/add(file: string, name: string): { fileId: number }`: upload a new file for a specifc classroom that belongs to the currently logged teacher.
- `file/replace(fileId: number, file: string, name: string): { fileId: number }`: upload a file to replace an existing one, provided they have the same mime type.
- `file/delete(fileId: number): boolean`: delete a file permanently.

The name of file to upload must be unique in a classroom. uploading a file with a name of another file that already exists is forbidden. You can only do this with `file/replace` and specify the id of the file to replace.

In route `#/teacher/[classroom]/home`, There is the list of available activities.
I want two columns here: on the left, the list of the available activities (what is currently the content of this page) and on the right a section called "Ressources pédagogiques" with a table of files stored for this classroom and with the folling columns:

1. An icon depending on the mime type of the file
2. The name of the file
3. The size of the file in human friendly format (Kb, Mb, ...)
4. An action with icon <IconImport> to upload a file to replace this one. It is only possible tio upload a replacement file if it as the same mime type as the one to be replaced.
5. Last column, an <UiActionDelete> with confirmation to delete this file permanently
