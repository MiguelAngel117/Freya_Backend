const app = require('../src/app');
const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv/config');

describe("Prueba del modelo de categorías", () => {

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

    describe('Create Category', () => {
        it("Debe responder con estado 201 y crear una nueva categoría", async () => {
            const categoryData = {
                name_category: "Blusas",
                description_category: "Categoría de ropa",
                url_icon: "icon_url",
                url_image: "image_url",
                url_size_guide: "size_guide_url"
            };
            responseRegister = await request(app).post("/api/v1/categories/").send(categoryData).set(headerAdmin);
            expect(responseRegister.status).toBe(201);
            expect(responseRegister.body.name_category).toBe(categoryData.name_category);
        });
    });

    describe('Get categories', () => {
        it("Debe responder con estado 200 y traernos todas las categorías", async  () => {
            const response = await request(app).get("/api/v1/categories/").set(headerAdmin);         
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });

        it("Debe responder con estado 200 y traernos una categoría", async  () => {
            const response = await request(app).get(`/api/v1/categories/${responseRegister.body._id}`).set(headerAdmin);         
            expect(response.status).toBe(200);
        });

        it("Debe responder con estado 404, dado que el id de la categoría no existe", async  () => {
            const response = await request(app).get(`/api/v1/categories/60000000000000dc4fcd9cdc`).set(headerAdmin);         
            expect(response.status).toBe(404);
        });
    })

    describe('Update categories', () => {
        const categoryDataUpdate = {
            name_category: "Pantaloncillo",
            description_category: "Bermudas para todos",
            url_icon: "https//hola"
        };
        it("Debe responder con estado 200 y actualizar los valores de la categoría", async  () => {
            const response = await request(app).put(`/api/v1/categories/${responseRegister.body._id}`).send(categoryDataUpdate).set(headerAdmin);         
            expect(response.status).toBe(200);
            expect(response.body.name_category).not.toBe(responseRegister.name_category);
        });

        it("Debe responder con estado 404, dado que el id de la categoría no existe por lo cual no se puede actualizar la categoría", async  () => {
            const response = await request(app).put(`/api/v1/categories/60000000000000dc4fcd9cdc`).send(categoryDataUpdate).set(headerAdmin);         
            expect(response.status).toBe(404);
        });
    })

    describe('Get categories by name', () => {
        it("Debe responder con estado 200 y traernos todas las categorías que coincidan con el nombre de la categoría", async  () => {
            const nameCategory = "Panta";
            const response = await request(app).get(`/api/v1/categories/search?name_category=${nameCategory}`).set(headerAdmin);
            expect(response.status).toBe(200);
            for (const value of response.body) {
                expect(value.name_category.includes(nameCategory)).toBe(true);
            }
        });
    })

    describe('Delete Category', () => {
        it("Debe responder con estado 200 y borrar la categoría", async  () => {
            const response = await request(app).delete(`/api/v1/categories/${responseRegister.body._id}`).set(headerAdmin);         
            expect(response.status).toBe(200);
        });

        it("Debe responder con estado 404 ya que la categoría que se quiere borrar ya no existe", async  () => {
            const response = await request(app).delete(`/api/v1/categories/${responseRegister.body._id}`).set(headerAdmin)         
            expect(response.status).toBe(404);
        });
    })
});

