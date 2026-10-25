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
