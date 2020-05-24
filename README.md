Base URL: https://koajs-graphql.herokuapp.com/

# How to execute

## Clone project to your machine

#### Make sure you have yarn or npm installed on your machine

Inside the project folder, run the command **yarn** or **npm i** for dependencies to be installed.

Run command **cp .env.example .env**.

NOTE: if you want to run the app without a docker container, make sure you have **MongoDB** installed in your machine or put the mongo database remote url in **.env** file.

At the end of this installation, inside the project folder run the command **yarn dev** or **npm run dev** for development environment so that API is executed.

Or run the command **yarn start** or **npm run start** for production environment to run a **pm2** instance of application.

### Running the application in a docker container

First of all, make sure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed and running on your after that, inside the application folder, enter the terminal and execute the command **docker-compose up** and with that the application should be running and you can proceed to the next step. NOTE: the URL has been configured to be the same as it would be called if you were not running in a container. **URL http://localhost:3333**

### Testing the API routes

For this you can use some software that tests Http requests, I recommend using [Postman](https://www.getpostman.com/) or [Insomnia](https://insomnia.rest/download/)

### How to use GraphQL endpoint
Make your url with the GraphQL common query.

ex1: {host}/graphql/users?query={user(id:"5ec6e5e8ed00d82ee7574647"){name}}

ex2: {host}/graphql/users?query={users{_id,name}}

### Running integration tests

The tests will be running with **Jest**

Use the following command to run tests: **yarn test** or **npm run test**
