I need a new activity `office/markdown` to teach students how to use Markdown format.

this activity will be very similar to activity `frontend/src/app/student/[classroom]/activity/office/selection`:

- On the right, the markdown preview of what is expected (not the code)
- On the left, the code to edit in order to reach the preview in the right

The initial code is the text content of what makes the right preview without all the formatting syntax. The student will have to add this syntax to get the correct result.

Each exercise must introduce a new Markdown syntax, in order to teach them progressively. And the text of the exercises must talk about this new syntax, without writing examples.

We do not count the number of key strokes here. On;ly the final result counts and we check it only once the student slicks on the "Suivant" button at the right of the activity header (just before the help floating button).

The help opens a modal with all the syntaxes of markdown (Github flavored) with examples.

We also need a "Précédent" button just before the "Suivant" to go back to the previous exercise.

"Suivant" first checks if the solution is reached. That means that the markdown written by the student must be equivalent to the expected one. To be equivalent, two markdown must produce the same preview (not counting extra spaces at the end or where they are invisible).

What do you think? Are they some caveats? Do you have other ideas?
