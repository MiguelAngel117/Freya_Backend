const app = require('../src/app');
const request = require ('supertest');

//Si existe una ruta 
describe('Server Running',()=>{
    test("Should respond with a 200 Status code", async()=>{
       const response = await request(app).get('/').send();
       expect(response.statusCode).toBe(200);
    });
});