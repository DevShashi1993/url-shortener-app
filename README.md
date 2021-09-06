# url-shortener-app

This is a url shortening app like https://bitly.com/, https://tinyurl.com/app, where users can create encrypted short url from any other existing url.

### Prerequisite

* [PostgreSQL v12](https://www.postgresql.org/)
* [pgAdmin v4 - for Windows](https://www.pgadmin.org/download/pgadmin-4-windows/)
* [Express.js middleware v4](https://expressjs.com/)
* [Node.js v12](https://nodejs.org/es/)
* [Nodemon](https://www.npmjs.com/package/nodemon) installed globally, so that backend server will automatically restart after code changes.
* [Postman API](https://www.postman.com/downloads/) to simulate a frontend. (optional)
* [VS Code](https://code.visualstudio.com/download) or any code editor to edit the source code. (optional)
* Clone this repository.

### Setting up the Project

#### Server-Side

* Open the cloned directory and change to `/server` directory
* Install dependencies using `npm i`
* Install [nodemon v2.0.2](https://www.npmjs.com/package/nodemon) globally if you don't already have it
* Install [PostgreSQL](https://www.postgresql.org/) & run it (requires the password you created during installation)
* Create a rename the `.env_example` to `.env` and add database access credentials to it - recommend installing [npm dotenv](https://www.npmjs.com/package/dotenv) & using .env to hide credentials if commiting to Github
* Open the pgAdmin and create a Database named as **usapp**. 
* Copy the schema script from `schema.sql` file and paste into the Query tool in pgAdmin and exetute the script.
* Run `nodemon server` for a dev server
* `http://localhost:5000/` can be accessed for CRUD operations such as POST, GET, PUT, DELETE etc. using Postman

#### Client-Side

* Open the cloned directory and change to `/client` directory
* Install dependencies using `npm i` or `yarn install`
* run `npm start` or `yarn start`. Frontend will open at `http://localhost:3000/`