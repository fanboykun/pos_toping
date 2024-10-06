## Requirement
    - SQLite
    - Nodejs

## Serverless Requirement
    - Turso as Serveless SQLite Database
    - Vercel as Serverless
  
## Configuration
> First, make sure you already make or have the database for this project

Follow this steps to prepare the project

```bash
# copy the .env.example to .env file
cp .env.example .env
# then, input the database url in the .env

# install all of the dependencies
pnpm i

# migrate the prisma model to generate prisma types
npx prisma migrate dev

# or update/push the database schema
npx prisma db push

# seed the dummy data to the database
npx prisma db seed
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev --open
```
> Then, Log in to the account with the seeded user (see seed.ts insertUser function)


## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
