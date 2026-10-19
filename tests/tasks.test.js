const request = require('supertest');
const app = require('../app');

async function createTask(title = 'Test task') {
  const res = await request(app).post('/api/tasks').send({ title });
  return res.body;
}

describe('GET /api/tasks', () => {
  it('returns a list of tasks', async () => {
    const task = await createTask('Buy milk');

    const res = await request(app).get('/api/tasks');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toContainEqual(task);
  });
});

describe('POST /api/tasks', () => {
  it('creates a task', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Walk the dog' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'Walk the dog', completed: false });
    expect(typeof res.body.id).toBe('number');
    expect(typeof res.body.createdAt).toBe('string');
  });

  it('returns 400 when the title is missing', async () => {
    const res = await request(app).post('/api/tasks').send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 when the title is empty', async () => {
    const res = await request(app).post('/api/tasks').send({ title: '   ' });

    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/tasks/:id', () => {
  it('updates the title', async () => {
    const task = await createTask('Old title');

    const res = await request(app).patch(`/api/tasks/${task.id}`).send({ title: 'New title' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('New title');

    const list = await request(app).get('/api/tasks');
    const saved = list.body.find((t) => t.id === task.id);
    expect(saved.title).toBe('New title');
  });

  it('marks a task as completed', async () => {
    const task = await createTask('Finish homework');

    const res = await request(app).patch(`/api/tasks/${task.id}`).send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);

    const list = await request(app).get('/api/tasks');
    const saved = list.body.find((t) => t.id === task.id);
    expect(saved.completed).toBe(true);
  });

  it('returns 404 for a task that does not exist', async () => {
    const res = await request(app).patch('/api/tasks/99999').send({ completed: true });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('deletes a task', async () => {
    const task = await createTask('Delete me');

    const res = await request(app).delete(`/api/tasks/${task.id}`);
    expect(res.status).toBe(204);

    const list = await request(app).get('/api/tasks');
    expect(list.body.find((t) => t.id === task.id)).toBeUndefined();
  });

  it('returns 404 for a task that does not exist', async () => {
    const res = await request(app).delete('/api/tasks/99999');

    expect(res.status).toBe(404);
  });
});
