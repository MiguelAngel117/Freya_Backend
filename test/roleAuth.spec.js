const request = require('supertest');
const express = require('express');
const checkRoleAuth = require('../src/middleware/roleAuth');
const userModel = require('../src/models/user');

jest.mock('../src/models/user');

const app = express();

app.use(checkRoleAuth(['admin']));

app.get('/protected-route', (req, res) => {
  res.status(200).send('Authorized');
});

describe('checkRoleAuth middleware', () => {
  it('should return 409 status if user role is not included in roles array', async () => {
    userModel.findById.mockResolvedValue({ role: 'user' });

    await request(app)
      .get('/protected-route')
      .set('Authorization', 'Bearer token')
      .expect(409)
      .expect('No tienes permisos');
  });

  it('should return 200 status if user role is included in roles array', async () => {
    userModel.findById.mockResolvedValue({ role: 'admin' });

    await request(app)
      .get('/protected-route')
      .set('Authorization', 'Bearer token')
      .expect(200)
      .expect('Authorized');
  });
});
