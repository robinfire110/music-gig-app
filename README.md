# CSC 490 - Music Gig App
Made by Andy Bonola, Craig Smith and Andy Villasmil

## Developer Installation Setup
### Prerequisites
#### NodeJS
Can be downloaded [here](https://nodejs.org/en/download/). I set this up using the LTS version 20.11.1.

#### Visual Studio Code 
Any IDE works theoretically though, that's just what I used

#### MySQL Server 
This is your local database for development until we get a hosted one running (or if you just want to run the program without connecting to the main database). 

You can download a local install of the server using [this link](https://dev.mysql.com/downloads/installer/). Here is a [quick video tutorial](https://www.youtube.com/watch?v=u96rVINbAUI) on how to set it up. It's slightly outdated, but it's mostly the same. You don't have to download MySQL Workbench if you don't want to. It's useful for viewing the database, but not required. For the local development database, set the password to ```password```. Very insecure, but it doesn't matter for the local versions with fake data. We'll use actually good passwords for the real deal.

Once you have the server installed, be sure to run ```CREATE DATABASE dev_db``` in the MySQL terminal in order to create the local database. If you used Windows to download, you can use MySQL Workbench to run the command or open the MySQL Command Line Client that was installed with the server to run it. If you're on linux, I think you can just run it straight through the terminal, but you may have to check to be sure.

#### Postman (or some other similar application)

Postman allows you to test HTTP requests to make sure everything is functioning properly. For use with a localhost, you will have the download the app, which you can find [here](https://www.postman.com/downloads/).

## Initial Setup
1. In your IDE terminal, change your working directory to the "server" folder. In there run ```npm install```. That will install all the backend server packages.
2. Change your directory to the "client" folder and run the same command to install the front end packages.
3. Run the backend by changing your directory to the "server" folder and running ```npm run dev```. This will start the backend using nodemon. You can use ```npm run start``` to start node without nodemon.
4. Run the frontend by changing your directory to the "client" folder and running ```npm run start```. This will start the frontend, and open a new tab in your web browser showing the website's landing page.

## Development Packages
I've found that there are several common packages that may make our lives a bit easier in the long run. It's a bit more learning we have to do up front, but I think it'll be worth it. Here's some information about each.

* **[Express](https://expressjs.com/)** - We already talk about this, but Express is very useful for settings up routes. The documentation is [here](https://expressjs.com/en/4x/api.html).

* **[Sequelize](https://sequelize.org/)** - It's an ORM (Object-Relational Mapping) that allows us to create and update the database using objects instead of SQL statements. There are several benefits to this. One, it makes our code for uniform (all JavaScript, no direct SQL statements). Two, it's more secure since the package takes care of vulnerabilities such as SQL Injection. And three, it can simplify some more complex queries and (hopefully) minimize errors that would arise from writing straight SQL. You can find the documentation [here](https://sequelize.org/docs/v7/models/defining-models/), luckily it's pretty straightforward.

* **[Moment](https://momentjs.com/)** - Easier to use date and time manipulation and control objects. Use instead of built in JavaScript Date object. The documentation is [here](https://momentjs.com/docs/).

## Resource 

* **[API Documentation](https://documenter.getpostman.com/view/20451093/2sA2xcausW) - This is the documentation for our internal API. It's made through Postman (which you don't have to use, that's just what I did). It has a list of all the requests you can make. We'll add more if needed and fix any errors as they appear.