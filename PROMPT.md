I need few improvements in the activity `frontend/src/app/student/[classroom]/activity/AI/neural-network`.

Fist of all, never display the biaises in the SVG. It aws confusing for the students and I don't explain the maths behinf the neuron trigger. the weight are fine to stay, though.

Then, in the input layers, we can have the value +1 or -1. But I want you to replace (only in the view, not in the calculations) the -1 of the SVG with a 0. That will match better a digit of a binary number.

I want to tech the students that a neural network can guess things it has never learned directly. That's why, I want the array to have only 7 items, not 8. And in the result of training, that is just below the sentence "Après correction, le réseau devine pour chaque case", there is this table 8x2. We keep the last column, but the cells should be borderred by dotted lines. By the way, the other cells of the table should also get a black border, and the green background should never be applied in the first row, only on the percentages of the second row. And for the one on this second row that are bad guesses, I want a red background, except for the last column because this is not in the arrya of 7 items to guess, but this is more of an extrapolation that the model can do.
