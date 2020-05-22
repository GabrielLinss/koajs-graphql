const request = require('supertest');
const server = require('../../server');
const User = require('../../src/app/models/User');

describe('Users', () => {
  afterAll(() => {
    server.close();
  });

  afterAll(async () => {
    await User.remove({});
  });

  beforeEach(() => {
    jest.setTimeout(30000);
  });

  it("should be able to save one user", async () => {
    const payload = { name: 'test', email: 'test@mail.com', password: '1234' };

    const response = await request(server).post('/users').send(payload);

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });

  it("should be able to authenticate an user", async () => {
    const payload = { name: 'test', email: 'test2@mail.com', password: '1234' };

    const response = await request(server).post('/users').send(payload);

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');

    const auth = await request(server).post('/authenticate').send({ email: payload.email, password: payload.password });

    expect(auth.status).toEqual(200);
    expect(auth.body).toHaveProperty('token');
  });

  it("should be able to return all users", async () => {
    const response = await request(server).get("/users");

    expect(response.status).toEqual(200);
  });

  it("should be able to show one user", async () => {
    const payload = { name: 'test', email: 'test3@mail.com', password: '1234' };

    const response = await request(server).post('/users').send(payload);

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('user');

    const user = await request(server).get(`/users/${response.body.user._id}`);

    expect(user.status).toEqual(200);
    expect(user.body).toHaveProperty('_id');
    expect(user.body).toHaveProperty('name');
    expect(user.body).toHaveProperty('email');
  });

  it("should be able to update one user", async () => {
    const payload = { name: 'test', email: 'test4@mail.com', password: '1234' };

    const response = await request(server).post('/users').send(payload);

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('user');

    const nameToUpdate = 'test updated';

    const user = await request(server)
                            .put(`/users/${response.body.user._id}`)
                            .set('Authorization', `Bearer ${response.body.token}`)
                            .send({ name: nameToUpdate });

    expect(user.status).toEqual(200);
    expect(user.body).toHaveProperty('name');
    expect(user.body.name).toEqual(nameToUpdate);
  });

  it("should be able to remove one user", async () => {
    const payload = { name: 'test', email: 'test5@mail.com', password: '1234' };

    const response = await request(server).post('/users').send(payload);

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('user');

    const removeUser = await request(server)
                            .delete(`/users/${response.body.user._id}`)
                            .set('Authorization', `Bearer ${response.body.token}`);

    expect(removeUser.status).toEqual(204);
  });
});
