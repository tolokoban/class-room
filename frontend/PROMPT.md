Demo mode soundd great. But here what I really want in the end.

In demo mode we act as if the current user was a teacher.
The login nickname will be "Demo Teacher" and the only difference
with a real teacher is that nothing is never sent to the backend.
We use the IndexDB for all entrypoints.
For files uploads, we need a special table in IndexDB.

In the future, I will add Stripe to let people rent a teacher period and then access the full potential of applications.
So, I need a header above everything else, with strong colors and a short message saying that you can become a teacher by contacting the website admin. A button will open an email client with `contact@tolokoban.org`.

All the fetches of AI models are allowed.

For now, we don't want to generate any seed data.
The demo must only show what a teacher can do, not a student.

Thats's why we need a link just below the teacher login box, that will start the demo mode by logging the user as the fake "Demo Teacher".

Always remember to keep in sync the demoAPi with the real API.

What do you think of this proposition?
