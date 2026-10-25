I need you to implement the backend (in folder `backend/`) for my project in docker.
It will provide a Apache webserver, a MariaDB server (only visible by the Apache server, not outside Docker) and a PhpMyAdmin that we can reach at `http://localhost:{port}/phpMyAdmin`.

The port must be a random (and free) one. At the root of this project, you will add a `package.json` file with an action `npm run backend` that will start the docker (after turning down any one already active), choose a random (and free) port and use it fir the webserver, and finally open a browser (the defaut one or Firefox) on this port.

Here is a description of the current file structure:

- `backend/www`: all files served by the webserver in docker
- `backend/www/api`: all the PHP to deal with REST services
- `backend/www/api/entrypoint`: implementation of the enrypoints
- `backend/database/data`: all the data used by MariaDB (used from docker container)
- `backend/database/sql`: the SQL files to initialize the database structure

I need a table `role` with this structure:
```ts
{
    id: number
    name: string
}
```
It must be initialized with 3 roles: "admin", "teacher" and "student".

I also need a table `user` with:
```ts
{
    id: number
    name: string
    login: string
    password: string
}
```

And a table `user_role`:
```ts
{
    user: number
    role: number
}
```

I need an entrypoint `user/login` based on what has been done in this file: `/Users/tolokoban/Code/ulteam8-flotte/backend/php/api/entrypoint/login/index.php`.
And `user/logout` to logout the current user.

I need a table `class`:
```ts
{
    id: number
    user: number // Author (with role teacher)
    code: string // The code to give the students to access the class (must be unique in the DB and indexed)
    name: string
    description: string // Markdown decription of this class room
}
```

I need entrypoints to manage a class room (table `class`):
- `class/add`: create a new class room, only for users with role `teacher`. Check if the `code` is unique.
- `class/list`: list all the classes rooms of the current user.
- `class/update`: update an existing class room.
- `class/delete`: delete a class room.

Finally, in `package.json`, I need an action `npm run db-graph` that does the same think as in `/Users/tolokoban/Code/ulteam8-flotte/package.json`.

Read also this file to have more details: `CLAUDE.md`.