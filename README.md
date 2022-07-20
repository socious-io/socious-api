## Installation

```bash
$ npm install
$ cp template.env .env
$ $EDITOR .env
```

## Running the app

```bash
# development
$ npm start

# watch mode
$ npm run start:debug
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Development helpers

```bash
# set up commit hooks
$ npm run prepare

# create new migration
$ npm run new-migration descriptive-name && npx prettier --write migrations/*.js

# run pending migrations locally
$ npm run migrate
```

## Development Process

Follow the ‘future process’ as described in (Socious Development Workflow)[https://www.notion.so/Socious-Development-Work-Flow-e6139ec5119b461ea20516da3b0fbf9d#ccc95257679543a893dcd4fc65cc5075].

## Development Resources

Check the (Notion Engineering section)[https://www.notion.so/4b955198c9724210bbe5a75fb773bded?v=a2e2ca1138164f2eb9fc937a7e304509] for more details.
