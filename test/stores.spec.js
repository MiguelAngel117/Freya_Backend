const app = require('../src/app');
const request = require('supertest')
const mongoose = require('mongoose');
require('dotenv/config');

describe("Prueba del modelo de tiendas", () => {

    let headerAdmin;
    let responseRegister;

    beforeAll(async()=>{
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
    })
    afterAll(async()=>{ 
        await mongoose.disconnect();
    });


    describe('Register Store', () => {
        it("Debe responder con estado 201 y crear una nueva tienda", async () => {
            const storeData = {
                name_store: "Americanino",
                address: "Diagonal 45A # 8 -41",
                department: "Boyacá",
                city: "Sogamoso",
                images: ["https://situr.boyaca.gov.co/wp-content/uploads/2022/11/SOGAMOSO-8.jpg","https://hola.com"]
            };
            responseRegister = await request(app).post("/api/v1/stores/").send(storeData).set(headerAdmin);
            expect(responseRegister.status).toBe(201);
            expect(responseRegister.body.name_store).toBe(storeData.name_store);
        });
    });

    describe('Get stores', () => {
        it("Debe responder con estado 200 y traernos todas las tiendas", async  () => {
            const response = await request(app).get("/api/v1/stores/").set(headerAdmin);         
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });

        it("Debe responder con estado 200 y traernos una tienda", async  () => {
            const response = await request(app).get(`/api/v1/stores/${responseRegister.body._id}`).set(headerAdmin);         
            expect(response.status).toBe(200);
        });

        it("Debe responder con estado 404, dado que el id de la tienda no existe", async  () => {
            const response = await request(app).get(`/api/v1/stores/60000000000000dc4fcd9cdc`).set(headerAdmin);         
            expect(response.status).toBe(404);
        });
    })

    describe('Update stores', () => {
        const storeDataUpdate = {
            name_store: "Americanino final",
            address: "Diagonal 48A # 8 -41",
            city: "Paipa"
        };
        it("Debe responder con estado 200 y actualizar los valores de la tienda", async  () => {
            const response = await request(app).put(`/api/v1/stores/${responseRegister.body._id}`).send(storeDataUpdate).set(headerAdmin);         
            expect(response.status).toBe(200);
            expect(response.body.name_store).not.toBe(responseRegister.name_store);
        });

        it("Debe responder con estado 404, dado que el id de la tienda no existe por lo cual no se puede actualizar la tienda", async  () => {
            const response = await request(app).put(`/api/v1/stores/60000000000000dc4fcd9cdc`).send(storeDataUpdate).set(headerAdmin);         
            expect(response.status).toBe(404);
        });
    })

    describe('Get stores by name', () => {
        it("Debe responder con estado 200 y traernos todas las tiendas que coincidan con el nombre de la tienda", async  () => {
            const nameStore = "Americanino";
            const response = await request(app).get(`/api/v1/stores/search?name_store=${nameStore}`).set(headerAdmin);
            expect(response.status).toBe(200);
            for (const value of response.body) {
                expect(value.name_store.includes(nameStore)).toBe(true);
            }
        });
    })

    describe('Delete Store', () => {
        it("Debe responder con estado 200 y borrar la tienda", async  () => {
            const response = await request(app).delete(`/api/v1/stores/${responseRegister.body._id}`).set(headerAdmin);         
            expect(response.status).toBe(200);
        });

        it("Debe responder con estado 404 ya que la tienda que se quiere borrar ya no existe", async  () => {
            const response = await request(app).delete(`/api/v1/stores/${responseRegister.body._id}`).set(headerAdmin)         
            expect(response.status).toBe(404);
        });
    })
});
