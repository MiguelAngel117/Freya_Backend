require('dotenv').config();
const jwt = require('jsonwebtoken');

const tokenSign = async (user) => {
    return jwt.sign(
        {
            _id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "2h",
        }
    );
};

const verifyToken = async (token)=>{
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error in Generate Token");
    }
};

const decodeDesign = null;

module.exports = {tokenSign, verifyToken, decodeDesign};