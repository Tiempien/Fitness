# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.
## Setup

Make sure to install dependencies:

```bash
# npm
npm install

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev
```

## Using SSL
The application uses nuxt-auth-utils, which sets a http secure cookie.   
Use the following code to generate a ssl certificate for development purposes.
```
openssl genrsa 2048 > server.key
chmod 400 server.key
openssl req -new -x509 -nodes -sha256 -days 365 -key server.key -out server.crt
``` 

## Production

Build the application for production:

```bash
# npm
npm run build
```

Locally preview production build:

```bash
# npm
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


# Database Migrations and Seeders
### Important the commands in the .server folder (yourpc/beeldbank-admin/server)

## Making a migraiton
To make a model, run:
```
 npx sequelize-cli model:generate --name People --attributes firstName:string,lastName:string,email:string
```

Rename the file to .ts and make sure it follows the structure of `example.ts`.

### 

## Applying Migrations
To apply migrations to the database, run the following command:
```
npx sequelize-cli db:migrate
```

## Rolling Back Migrations
To undo the last applied migration, use:
```
npx sequelize-cli db:migrate:undo
```

## Using Seeders
### Generating a Seeder
To generate a new seeder, run:
```
npx sequelize-cli seed:generate --name demo-user
```

### Running Seeders
To execute all seeders, use:
```
npx sequelize-cli db:seed:all
```

### Rolling Back Seeders
To undo applied seeders, run:
```
npx sequelize-cli db:seed:undo
```