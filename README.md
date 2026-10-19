# Task Manager

A small to-do list app built with Node.js and Express. Tasks are stored in memory, so they reset whenever the server restarts.

## Setup

You need [Node.js](https://nodejs.org/) 18 or newer.

```bash
npm install
npm start
```

Then open http://localhost:3000 in your browser.

To run the tests:

```bash
npm test
```

## Project structure

```
app.js            Express app and API routes (exported for tests)
server.js         Starts the app on port 3000
public/           Frontend (HTML, CSS, JavaScript)
tests/            Jest + Supertest API tests
```

## API

| Method | Endpoint          | Description                          |
| ------ | ----------------- | ------------------------------------ |
| GET    | /api/tasks        | List all tasks                       |
| POST   | /api/tasks        | Create a task (`title` is required)  |
| PATCH  | /api/tasks/:id    | Update a task's `title` or `completed` |
| DELETE | /api/tasks/:id    | Delete a task                        |

## Example curl commands

List all tasks:

```bash
curl http://localhost:3000/api/tasks
```

Create a task:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy milk"}'
```

Mark a task as completed:

```bash
curl -X PATCH http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

Rename a task:

```bash
curl -X PATCH http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy oat milk"}'
```

Delete a task:

```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```
