# Face4Database 🔥

The "Face4Database" is  based on Express, jQuery, JavaScript, HTML5 & CSS for a SQL database, allowing editing, and updating of database.
This app can also be used to retrieve results from MySQL database as JSON as in APIs.

## Structure

1. Javascript send queries with `GET` requests, and process the results on the webpage.

2. Node.js server check the requests, and turn it into sql queries, return the results of SQL queries

## Installation

1. Clone this repo by snippet below: 
   
   `git clone https://github.com/doctorbhatti/face4database.git`
2. Run `npm install` to intsall dependencies
3. Edit `src/app.js` to fill out the databse credentials on line #8
4. Run `npm start` and browse to localhost:8081

## Requirements

* Each table must have a auto increment field `ID` as its primary key(or at least unique not null)

## RESTful API

1. Queries

* `localhost:8081/{table name}/get` : query all table contents and gets result back in JSON
* `localhost:8081/{table name}/insert` : insert a new line into the db, the values of the columns is in the POST data, separated by EOL

* `localhost:8081/{table name}/delete?id={id}` : delete a line from db
  
* `localhost:8081/{table name}/update?id={id}` : update a single row with POST request, in the POST request, each value of the updated columns takes up a line

2. Display data in HTML tables
   
* `localhost:8081/{table name}/show` : will show all the data from database table in HTML table with pagination support


## Screenshots

Table View of Database
![Table View of database](https://i.imgur.com/TOj6eZk.png)

JSON Results from API
![JSON Results from API](https://i.imgur.com/MtSvm6z.png)

##

FURTHER WORK IN PROGRESS.

ANY SUGGESTIONS/PRs ARE WELCOMED.