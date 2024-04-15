const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

require('dotenv/config');

app.use(cors());
app.options('*', cors())

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));

//Routes 
const authRoute = require('./routes/api/auth');
const storesRoute = require('./routes/api/stores');
const articlesRoute = require('./routes/api/articles');
const usersRoute = require('./routes/api/users');
const categoriesRoute = require('./routes/api/categories');
const salesRoute = require('./routes/api/sales');
const purchasesRoute = require('./routes/api/purchases');
const jobsRoute = require('./routes/api/jobs');

const api = process.env.BASE_URL;

app.use(require('./routes'));

//authRoute(app);
//storesRoute(app);
/*articlesRoute(app);
usersRoute(app);
categoriesRoute(app);
salesRoute(app);
purchasesRoute(app);
jobsRoute(app);*/


//app.use(`${api}/auth`, authRoute);
//app.use(`${api}/stores`, storesRoute);
//app.use(`${api}/articles`, articlesRoute);
//app.use(`${api}/users`, usersRoute);
//app.use(`${api}/categories`, categoriesRoute);
//app.use(`${api}/sales`, salesRoute);
//app.use(`${api}/purchases`, purchasesRoute);
//app.use(`${api}/jobs`, jobsRoute);

app.get("/", (req, res) => {
    res.send("La App está corriendo");
});

module.exports = app;