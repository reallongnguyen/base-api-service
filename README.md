# API Service

## Description

The API service handles lightweight CRUD API in your system

## Installation

```bash
yarn install
```

### Preparation environment variables `.env`

### Running the depend services

In the local, you can use Docker to start depend services:

- Postgres
- Redis
- MQTT

```bash
# Create dockers
docker compose up -d

# Migrate database
npx prisma db push
```

### Clean up

```bash
# Stop all dockers and remove volumes
docker compose down --volumes --remove-orphans
```

## Running the app

```bash
# development, watch mode
yarn run start:dev

# production mode
yarn run start:prod
```

## Test

```bash
# unit tests
yarn run test

# e2e tests
yarn run test:e2e

# test coverage
yarn run test:cov
```

## Using the Prisma ORM

### Migrate DB & generate models from the exist schema

```bash
# The db push command pushes the state of your Prisma schema file to the database without using migrations. It creates the database if the database does not exist
npx prisma db push

# The generate command generates assets like Prisma Client based on the generator and data model blocks defined in your prisma/schema.prisma file
npx prisma generate
```

### Create the new migration

```bash
# For use in development environments only, requires shadow database
npx prisma migrate dev --name <migration_name>
```

### Other commands

```bash
# Drop the database and re-create a new database
npx prisma migrate reset

# The migrate deploy command applies all pending migrations, and creates the database if it does not exist. Primarily used in non-development environments
prisma migrate deploy
```

See other commands: [prisma-cli-reference](https://www.prisma.io/docs/orm/reference/prisma-cli-reference)

### Ref

- [Prisma Overview](https://www.prisma.io/docs/orm/prisma-schema/overview)
- [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate/getting-started)

## Support

This project is an MIT-licensed open source project.

## Stay in touch

- Author - ISLING

## License

[MIT licensed](LICENSE).
