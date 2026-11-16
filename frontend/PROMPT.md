## Overview

I want to create a generic activity called "Production écrite".
It is different from the other activity I have created so far because the teacher can configure such "generic" activity and activate them per classroom.
The activity will be displayed as two columns (as usual, the columns become two consecutive blocks on small screens):

- left: a description of what is expected from the student (from a Markdown tet written by the teacher)
- right: two columns. A list of filenames with buttons to upload/delete the file. And a timer displaying the time left before the end of the exercise.

Once activated, such activity will be displayed to the student who will have to upload the expected files.
The timer is only here to give a hint, but the student can still upload files after the time is out.
The only restriction is that the student cannot upload anything before the timer starts.

Here is how a teacher can define a generic activity of written production:

```ts
interface ActivityWrittenProduction {
    // Unique name
    name: string
    // Markdown
    description: string
    startTime: number
    // Duration of the exercise in minutes
    duration: number
    // Expiration time in hours.
    expirationTime: number
    expectedFiles: Array<{
        name: string
        // Expected mime type.
        // An array lists all the accepted mime types.
        mimeType?: string | string[]
        // Max size in bytes
        maxSize: number
    }>
}
```

The list of `ActivityWrittenProduction` is stored in the database in a new table linked to the teacher.
We need a new page under route `#/teacher/[classroom]` to manage all the instances of `ActivityWrittenProduction`.
The teacher can create/edit/delete written productions, and assign some of them to class rooms. A written production can be assigned to many class rooms at the same time, and property `startTime` is the only prop that can be different from one class room to the other.

And in `frontend/src/app/teacher/[classroom]/home`, we need a new section with the list of the written production assigned to the current classroom. The one currently active must be highlighted, and we need an icon next to the others to activate them. the name of the activity is a hyperlink that leads to the page of the activity, as the student will see it.

We also need a result page. In this page, we see the timer and a list of the users that have uploaded at least one file.
For each user of the list, we see the list of the uploaded files with a link to open the file in another tab.
After this list, the description of the current written production is displayed as remainder of what the student have to do.

## Technical points

### Cleanup

Any student that knows the room's name can upload files and fill the storage space on the server.
That's why we don't want the files to be stored for ever. There is a property `expirationTime` expressed in hours and it has a default of 24 hours.
We may need a CRON TAB for this. But if there is another solution, that's even better.

Of course, the teacher can alway delete all the files of a specific written production, or even for all the written productions of an entire classroom. With a confirmation, of course, because we don't want to frustrate the students if the teacher does a mistake.

### File upload

There is already a way to upload files in the current code, but we just send the whole file as a big Base64 block.
It would be smarter to have several entrypoints:

1. Initializing the file by reserving a space on the server storage
2. Send a chunk for an initialized file
3. Mark a file as completely uploaded

This will allow a progress bar on the frontend, for instance.

## Before you start coding

For now, do now write any code. I just want us to brain storm on this.
Tell me what you would do in term of UX/UI and challenge the ideas in this prompt to see if it all works, or if there are holes that we could fill.
