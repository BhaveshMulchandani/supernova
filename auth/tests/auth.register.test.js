const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/user.model');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

afterEach(async () => {
  // clear all collections
  const collections = Object.keys(mongoose.connection.collections);
  for (const key of collections) {
    await mongoose.connection.collections[key].deleteMany({});
  }
});

test('POST /auth/register - successful registration', async () => {
  const payload = {
    username: 'alice',
    email: 'alice@example.com',
    password: 'password123',
    fullname: { firstname: 'Alice', lastname: 'Doe' }
  };

  const res = await request(app).post('/auth/register').send(payload);
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('id');
  expect(res.body.username).toBe(payload.username);
  expect(res.body.email).toBe(payload.email);

  const userInDb = await User.findOne({ username: payload.username });
  expect(userInDb).not.toBeNull();
  expect(userInDb.email).toBe(payload.email);
  expect(userInDb.password).not.toBe(payload.password); // should be hashed
});

test('POST /auth/register - duplicate username/email returns 409', async () => {
  const payload = {
    username: 'bob',
    email: 'bob@example.com',
    password: 'pass',
    fullname: { firstname: 'Bob', lastname: 'Smith' }
  };

  // create existing user
  const u = new User({ username: payload.username, email: payload.email, password: 'x', fullname: payload.fullname });
  await u.save();

  const res = await request(app).post('/auth/register').send(payload);
  expect(res.status).toBe(409);
  expect(res.body).toHaveProperty('message');
});
