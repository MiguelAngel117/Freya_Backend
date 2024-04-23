const app = require('../src/app');
const request = require('supertest')
const mongoose = require('mongoose');
require('dotenv/config');

describe("Test of Auth", () => {

    let responseRegister;
    let responseLogin;
    let headerAdmin;

    beforeAll(async () => {
        await mongoose.connect(process.env.CONNECTION_DB);
        const loginData = {
            email: "SUPERTEST@GMAIL.COM",
            password: "123"
        };
        const response = await request(app).post("/api/v1/auth/login").send(loginData);
        const token = response.body.tokenSession;
        headerAdmin = {
            Authorization: `Bearer ${token}`
        };
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('Register', () => {
        it("Debe responder con estado 201 y crear un nuevo usuario", async () => {
            const userData = {
                first_name: "Paco Antonio",
                email: "PACO@GMAIL.COM",
                password: "123"
            };
            responseRegister = await request(app).post("/api/v1/auth/register").send(userData);
            expect(responseRegister.status).toBe(201);
            expect(responseRegister.body.first_name).toBe(userData.first_name);
            expect(responseRegister.body.email).toBe(userData.email);
        });
    });

    describe('Login', () => {
         it("Debe responder con estado 200 y devolver un token de sesión", async () => {
             const loginData = {
                 email: "PACO@GMAIL.COM",
                 password: "123"
             };
             responseLogin = await request(app).post("/api/v1/auth/login").send(loginData);
             expect(responseLogin.status).toBe(200);
             expect(responseLogin.body.tokenSession).toBeDefined();
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
    
    describe('ChangePassword', ()=>{
        it("Debe responder con estado 200 y cambiar la contraseña", async () => {
            const data = {
                "oldPassword": "123",     
                "newPassword": "1234"
            }
            const response = await request(app).put(`/api/v1/auth/changePassword/${responseRegister.body._id}`).send(data);
            expect(response.status).toBe(200);
        });
        //Contraseña antigua no lo debe dear ingresar
        it("Debe responder con estado 409 si la contraseña es incorrecta", async () => {
            const loginData = {
                email: "PACO@GMAIL.COM",
                password: "123"
            };
            const response = await request(app).post("/api/v1/auth/login").send(loginData);
            expect(response.status).toBe(409);
        });

        //Contraseña nueva lo debe dejar ingresar
        it("Debe responder con estado 200 si la contraseña es correcta", async () => {
            const loginData = {
                email: "PACO@GMAIL.COM",
                password: "1234"
            };
            const response = await request(app).post("/api/v1/auth/login").send(loginData);
            expect(response.status).toBe(200);
        });
    });
    
    describe('Inactive User', ()=>{
        it("Debe responder con estado 200 he inhabilitar el usuario", async () => {
            const token = responseLogin.body.tokenSession;
            const header = {
                Authorization: `Bearer ${token}`
            };
            const inactiveUser = await request(app).put(`/api/v1/auth/${responseRegister.body._id}`).set(header);
            expect(inactiveUser.body).toBe(false);
        });
    });

    describe('get User', ()=>{
        it("Debe responder con estado 200 y entregar todos los usuarios, unicamente al administrador", async () => {
            const response = await request(app).get(`/api/v1/users/`).set(headerAdmin);
            expect(response.status).toBe(200);
        });

        it("Debe responder con estado 400 y No entregar información - Solo el administrador puede", async () => {
            const response = await request(app).get(`/api/v1/users/`).set({
                Authorization: `Bearer ${responseLogin.body.tokenSession}`
            });
            expect(response.status).toBe(409);
        });

        it("Debe responder con estado 200 y entregar la información de un usuario, esto lo puede hacer tanto el usuario normal como el administrador", async () => {
            const response = await request(app).get(`/api/v1/users/${responseRegister.body._id}`).set(headerAdmin);
            expect(response.status).toBe(200);
        });
    });

    //ONLY USER WITH ROLE ADMIN CAN DELETE A USER
    describe('Delete', ()=>{
        //No tiene permisos para borrar un usuario
        it("No debe poder borrar el usuario dado que no tiene el rol de admistrador sino de usuario", async () => {
            const deleteUser = await request(app).delete(`/api/v1/users/${responseRegister.body._id}`).set({
                Authorization: `Bearer ${responseLogin.body.tokenSession}`
            });
            expect(deleteUser.status).toBe(409);
        });

        it("Debe responder con estado 200 y borrar el usuario", async () => {
            const deleteUser = await request(app).delete(`/api/v1/users/${responseRegister.body._id}`).set(headerAdmin);
            expect(deleteUser.status).toBe(200);
        });
    });
});
