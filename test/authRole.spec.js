const app = require('../src/routes/users.js');
const request = require ('supertest');

describe('GET /', () => {
  test('It should respond with a 200 status code for admin user', async () => {
    const response = await request(app)
      .get('/')
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjExYzJkZDlmMDVhN2IwMjRkYzcyNGEiLCJyb2xlIjoidXNlciIsImlhdCI6MTcxMjQ1Nzc4NSwiZXhwIjoxNzEyNDY0OTg1fQ.8lTHmDpW2LdRJqJH5XxmALZ_W25_H3gPBSx27jx6rXo')
      .send();

    expect(response.statusCode).toBe(409);
  });
});
