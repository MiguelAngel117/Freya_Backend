const app = require('../src/app');
const request = require ('supertest');

//Si existe una ruta 
describe('Server Running',()=>{
    test("Debe encriptar una contraseña", async()=>{
       const response = await request(app).get('/').send();
       expect(response.statusCode).toBe(200);
    });
});