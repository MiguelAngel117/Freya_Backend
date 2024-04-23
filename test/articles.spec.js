const app = require('../src/app');
const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv/config');

describe("Prueba del modelo de artículos", () => {

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

    describe('Create Article', () => {
        it("Debe responder con estado 201 y crear un nuevo artículo", async () => {
            const articleData = {
                code_article: "AC22",
                name_article: "Camisa",
                retail_price: 50000,
                medium_price: 45000,
                wholesale_price: 40000,
                description_article: "Camisa de algodón",
                images: ["hhtp","hayta"],
                category: "6612e313476d1bc315bac987",
                stock: [["S", 10], ["M", 15], ["L", 20]],
                gender: "male",
                size_guide: "URL",
                color: "blue"
            };
            responseRegister = await request(app).post("/api/v1/articles/").send(articleData).set(headerAdmin);
            expect(responseRegister.status).toBe(201);
            expect(responseRegister.body.name_article).toBe(articleData.name_article);
        });
    });

    describe('Get articles', () => {
        it("Debe responder con estado 200 y traernos todos los artículos", async  () => {
            const response = await request(app).get("/api/v1/articles/").set(headerAdmin);         
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });

        it("Debe responder con estado 200 y traernos un artículo", async  () => {
            const response = await request(app).get(`/api/v1/articles/${responseRegister.body._id}`).set(headerAdmin);         
            expect(response.status).toBe(200);
        });

        it("Debe responder con estado 404, dado que el id del artículo no existe", async  () => {
            const response = await request(app).get(`/api/v1/articles/60000000000000dc4fcd9cdc`).set(headerAdmin);         
            expect(response.status).toBe(404);
        });
    })

    describe('Update articles', () => {
        const articleDataUpdate = {
            name_article: "Camisa final",
            description_article: "Camisa de lino",
            stock: [["S", 10], ["M", 10], ["L", 15]],
            gender: "female",
            size_guide: "URL2",
            color: "red"
        };
        it("Debe responder con estado 200 y actualizar los valores del artículo", async  () => {
            const response = await request(app).put(`/api/v1/articles/${responseRegister.body._id}`).send(articleDataUpdate).set(headerAdmin);         
            expect(response.status).toBe(200);
            expect(response.body.name_article).not.toBe(responseRegister.name_article);
        });

        it("Debe responder con estado 404, dado que el id del artículo no existe por lo cual no se puede actualizar el artículo", async  () => {
            const response = await request(app).put(`/api/v1/articles/60000000000000dc4fcd9cdc`).send(articleDataUpdate).set(headerAdmin);         
            expect(response.status).toBe(404);
        });
    })

    describe('Get articles by name', () => {
        it("Debe responder con estado 200 y traernos todos los artículos que coincidan con el nombre del artículo", async  () => {
            const nameArticle = "Chaqueta";
            const response = await request(app).get(`/api/v1/articles/search?name_article=${nameArticle}`).set(headerAdmin);
            expect(response.status).toBe(200);
            for (const value of response.body) {
                expect(value.name_article.includes(nameArticle)).toBe(true);
            }
        });
    })

    describe('Delete Article', () => {
        it("Debe responder con estado 200 y borrar el artículo", async  () => {
            const response = await request(app).delete(`/api/v1/articles/${responseRegister.body._id}`).set(headerAdmin);         
            expect(response.status).toBe(200);
        });

        it("Debe responder con estado 404 ya que el artículo que se quiere borrar ya no existe", async  () => {
            const response = await request(app).delete(`/api/v1/articles/${responseRegister.body._id}`).set(headerAdmin)         
            expect(response.status).toBe(404);
        });
    })
});

