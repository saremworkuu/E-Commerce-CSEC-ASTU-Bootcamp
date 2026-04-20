# Backend

Express backend scaffold with a simple health route and a clean folder structure for controllers, routes, services, models, middleware, utilities, validations, constants, and configuration.

## Run it

1. Install dependencies if needed:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm run dev
   ```
3. Check the health endpoint:
   - `GET /api/health`

## Structure

- `src/config` - environment and database setup
- `src/controllers` - request handlers
- `src/middleware` - error handling and request middleware
- `src/models` - database models
- `src/routes` - route definitions
- `src/services` - business logic
- `src/utils` - helper functions
- `src/validations` - request validation rules
- `src/constants` - shared constants
- `scripts` - automation scripts
- `tests` - test files
- `logs` - runtime logs
