# Project notes for Claude

For any UI / styling work in the frontend, follow the conventions described here
instead of rescanning the code:

@frontend/STYLES.md

## Testing

If you need to test a PHP code, please use the PHP engine that is inside the Docker container
defined here: `backend/Dockerfile`.

## Backend

### Database

The structure of the database is described here: `backend/database/sql/structure.sql`.
And it's initially filled with this file: `backend/database/sql/data.sql`.

### Entrypoints

The entrypoints are defined in folder `backend/www/api/entrypoint`.
They must define the variable `$ROLE` to specify access, and the function `entrypoint($input)` to implement the entrypoint behaviour.
The first think en entrypoint function must do is check the validity of the `$input`.
Errors are returned in the form of a negative number that should be unique among all entrypoints.
The error code is build with this formula : `- 10000*{group} + 100*{action} + {error}`.
For instance, with `backend/www/api/entrypoint/class/delete/index.php`, the `group` is "class" (2)
and the `action` is "delete" (4). Groups: user = 1, class = 2.

## Frontend

### Translations

All messages displayed to the user must always be translated in the four languages: "fr", "en", "de" and "it".
Never hardcode a message in a component: put it in the `translation` folder next to it (`translation.{fr,en,de,it}.ts`),
the French file being the reference for the keys.

To fill the placeholders `$1`, `$2`… of a translation, use the function generated for each key (its name ends with `$`):
write `tr.deleted$(user.name)` or `tr.page$(page, pageCount, total)`, never `tr.deleted.replace("$1", user.name)`.
For this to type-check, `useTranslation()` in `translation/index.ts` must not declare a return type (no `: typeof FR`).

### Components

Create omponents based on the template in `/Users/tolokoban/Code/class-room/@templates/component-css-module`. That means that every component is in its own folder. And if it uses sub-components that are not shared with others, the sub-component must be in a subfolder of this component.

The body of a component must be small. If it is too long, try to split it in meaningful sub-compoments.
The hooks should go in a file called `hooks.ts` in the same folder as the component that uses them.
