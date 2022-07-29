# Gif sharing app

Simple gif sharing app that allows users can upload gif files

## Features

- Users can login or register to app.
- Users can see their own gifs after login
- Users can upload multiple files at the same time by draging & drop
- Users can see progress and status of process while uploading
- Users can make individual gif file publicly and share it to unauthenticated user.
- Users can update file name, add tags and delete file.
- Unauthenticated user can see gif using public url.

## Tech

#### Client

- React 18.1.0
- React router v6
- Mui v5
- Formik
- Yup
- React Dropzone
- Apollo client
- Apollo upload client

#### Server

- Node
- Express
- Mongoose
- JWT
- Apollo server
- type-graphql
- graphql-upload

## Installation

### client

To run client, modify .env.example to .env and run:

```sh
cd client
npm i
npm run start
```

After running, you can access to http://localhost:3000

### Server

To run server, modify .env.example to .env and run:
(Node: please make sure mongodb is running and add user to database)

```sh
cd server
npm i
npm run start
```

After running, you can access to http://localhost:4000/graphql
