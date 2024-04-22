//const testServer = require('../src/helpers/testServer');
//const storesRoute = require('../src/routes/api/stores');
//const request = testServer(storesRoute);
const app = require('../src/app');
const request = require('supertest')
const mongoose = require('mongoose');
require('dotenv/config');

describe("Prueba de obtención de todas las tiendas", () => {
    beforeAll(async()=>{
        await mongoose.connect(process.env.CONNECTION_DB);
    })
    afterAll(async()=>{ 
        await mongoose.disconnect();
    });

    describe('Get stores', () => {
        let response;
        beforeEach(async()=>{
            response = await request(app).get("/api/v1/stores/").send();
        })
        it("Debe responder con estado 200", async  () => {         
            expect(response.status).toBe(200);
        });
        it("La peticion nos devuelve un array de Stores", async () => {         
            expect(response.body).toBeInstanceOf(Array);
        });
    })
});
