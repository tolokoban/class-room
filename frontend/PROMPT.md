I nedd to improve activity `frontend/src/app/student/[classroom]/activity/AI/RAG/embedding`.

Today, we use an embedding model to match prerecorded questions with the one asked by the student.
But this is not reliable enough.

so I want to try a new approach: first we try to tag the questions with the dependency parsing model "spaCy", "Stanza", "Trankit", or a SRL model (from hugging face).

I need help to choose the correct model, ans it must perform well in english and french.

The main idea is to decompose the question and then have more smaller spaces to match with my embedding model.

For instance, we can first look for verbs (actions), like "manger", "vivre", ... And depending on the nearest, we can then search for the object.

Let's take an example: "Mange-t-il de la viande".
The action is "Mange" and the object "de la viande".
In the space of actions, deduced from the prerecorded questions, we may have "mange", "dévore", "se nourrit", "vole", "vit", ... so we match the group made of "mange", "dévore" and "se nourrit". And then we search for the object in a subset of thinks that can be eaten. so "Il vit la nuit" won't be searched for.

The first step I wold like to implement, is that after every question form the student, we display the question with highlighting of the tags, and when the mouse hovers, we display a tooltip with the name og the tag.
This way I can better see how the tagging works, and we will see for the rest later.

What do you think?
