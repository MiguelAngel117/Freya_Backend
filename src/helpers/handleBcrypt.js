const bcrypt = require('bcryptjs');

const encrypt = async (text) => {
    return await bcrypt.hash(text, 10);
}
const compare = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword);
}

module.exports = {encrypt, compare};