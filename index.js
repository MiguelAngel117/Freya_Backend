const app = require('./src/app');
require('./src/connection/connect');

const port = 5000;

app.listen(port, () => {
    console.log(`Ready! 🚀, Server running http://localhost:${port}`);
});