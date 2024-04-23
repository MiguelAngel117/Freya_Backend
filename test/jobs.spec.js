const app = require('../src/app');
const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv/config');

describe("Pruebas para el modelo de empleos", () => {

    let headerAdmin;
    let responseRegister;

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

    describe('Crear Empleo', () => {
        it("Debe responder con estado 201 y crear un nuevo empleo", async () => {
            const jobData = {
                title: "Asesor de ventas",
                position: "Contador",
                salary: 8000000,
                requeriments: "Conocimientos en excel, habilidades blandas",
                ubication: "Bogotá",
                min_knowledge: "Bachiilerato - tecnico - Sin experiencia",
                responsibilities: "Coordinar las labores de venta"
            };
            responseRegister = await request(app).post("/api/v1/jobs/").send(jobData).set(headerAdmin);
            expect(responseRegister.status).toBe(201);
            expect(responseRegister.body.title).toBe(jobData.title);
        });
    });

    describe('Obtener Empleos', () => {
        it("Debe responder con estado 200 y traernos todos los empleos", async () => {
            const response = await request(app).get("/api/v1/jobs/").set(headerAdmin);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });

        it("Debe responder con estado 200 y traernos un empleo", async () => {
            const response = await request(app).get(`/api/v1/jobs/${responseRegister.body._id}`).set(headerAdmin);
            expect(response.status).toBe(200);
        });

        it("Debe responder con estado 404, dado que el id del empleo no existe", async () => {
            const response = await request(app).get(`/api/v1/jobs/60000000000000dc4fcd9cdc`).set(headerAdmin);
            expect(response.status).toBe(404);
        });
    });

    describe('Actualizar Empleo', () => {
        const jobDataUpdate = {
            salary: 900000,
            ubication: "Medellín",
            min_knowledge: "5 años de experiencia"
        };
        it("Debe responder con estado 200 y actualizar los valores del empleo", async () => {
            const response = await request(app).put(`/api/v1/jobs/${responseRegister.body._id}`).send(jobDataUpdate).set(headerAdmin);
            expect(response.status).toBe(200);
        });

        it("Debe responder con estado 404, dado que el id del empleo no existe por lo cual no se puede actualizar el empleo", async () => {
            const response = await request(app).put(`/api/v1/jobs/60000000000000dc4fcd9cdc`).send(jobDataUpdate).set(headerAdmin);
            expect(response.status).toBe(404);
        });
    });

    describe('Buscar Empleos por Título', () => {
        it("Debe responder con estado 200 y traernos todos los empleos que coincidan con el título del empleo", async () => {
            const titleJob = "Asesor";
            const response = await request(app).get(`/api/v1/jobs/search?title=${titleJob}`).set(headerAdmin);
            expect(response.status).toBe(200);
        });
    });

    describe('Eliminar Empleo', () => {
        it("Debe responder con estado 200 y borrar el empleo", async () => {
            const response = await request(app).delete(`/api/v1/jobs/${responseRegister.body._id}`).set(headerAdmin);
            expect(response.status).toBe(200);
        });

        it("Debe responder con estado 404 ya que el empleo que se quiere borrar ya no existe", async () => {
            const response = await request(app).delete(`/api/v1/jobs/${responseRegister.body._id}`).set(headerAdmin);
            expect(response.status).toBe(404);
        });
    });

    describe('Obtener Empleos Ordenados por Título', () => {
        it("Debe responder con estado 200 y traernos todos los empleos ordenados por título", async () => {
            const response = await request(app).get("/api/v1/jobs/sorted").set(headerAdmin);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });
});
