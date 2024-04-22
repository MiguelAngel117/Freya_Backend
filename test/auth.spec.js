const app = require('../src/app');
const request = require('supertest')
const mongoose = require('mongoose');
require('dotenv/config');

describe("Test of Auth", () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.CONNECTION_DB);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    let response;

    describe('Register', () => {
        it("Debe responder con estado 201 y crear un nuevo usuario", async () => {
            const userData = {
                first_name: "Paco Antonio",
                email: "PACO@GMAIL.COM",
                password: "123"
            };
            response = await request(app).post("/api/v1/auth/register").send(userData);
            expect(response.status).toBe(201);
            expect(response.body.first_name).toBe(userData.first_name);
            expect(response.body.email).toBe(userData.email);
        });
    });

    describe('Login', () => {
         it("Debe responder con estado 200 y devolver un token de sesión", async () => {
             const loginData = {
                 email: "PACO@GMAIL.COM",
                 password: "123"
             };
             const response = await request(app).post("/api/v1/auth/login").send(loginData);
             expect(response.status).toBe(200);
             expect(response.body.tokenSession).toBeDefined();
         });
 
         it("Debe responder con estado 404 si el usuario no existe", async () => {
             const loginData = {
                 email: "pancha@gmail.com",
                 password: "password123"
             };
             const response = await request(app).post("/api/v1/auth/login").send(loginData);
             expect(response.status).toBe(404);
         });
 
         it("Debe responder con estado 409 si la contraseña es incorrecta", async () => {
             const loginData = {
                 email: "PACO@GMAIL.COM",
                 password: "321"
             };
             const response = await request(app).post("/api/v1/auth/login").send(loginData);
             expect(response.status).toBe(409);
         });
     });
     
    describe('Inactive User', ()=>{
        it("Debe responder con estado 200 he inhabilitar el usuario", async () => {
            const inactiveUser = await request(app).put(`/api/v1/auth/${response.body._id}`);
            console.log(inactiveUser + "->")
            expect(inactiveUser.body).toBe(false);
            
        });
    });

    describe('Delete', ()=>{
        it("Debe responder con estado 200 y borrar el usuario", async () => {
            const deleteUser = await request(app).delete(`/api/v1/users/${response.body._id}`);
            expect(deleteUser.status).toBe(200);
        });
    });
});
