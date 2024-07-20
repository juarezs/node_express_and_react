# Node & React exam code

A project for demonstrating the result of a coding exam solution.

#### Some of the requirements:

- Backend: Implement a backend service using node.js, with a non opinionated framework.
  - /users: Endpoint to retrieve the list of uploaded users.
  - /files: Endpoint to allow uploadind a file with all users to populate into database. Expected file is a csv with following layout:
 ```
 name,city,country,favorite_sport
John Doe,New York,USA,Basketball
Jane Smith,London,UK,Football
Mike Johnson,Paris,France,Tennis
Karen Lee,Tokyo,Japan,Swimming
Tom Brown,Sydney,Australia,Running
Emma Wilson,Berlin,Germany,Basketball
 ```
 
- Frontend: Implement a SPA frontend portal using react.

  - A single page with a button to upload the csv file.
  - A text field to search users. Search should work for any field, not just the name.
  - Display the results in cards.

#### Running locally:
Both projects can be executed with following command:
```
npm run dev
```

#### Run tests:
Both projects tests can be executed with following command:
```
npm run test
```
