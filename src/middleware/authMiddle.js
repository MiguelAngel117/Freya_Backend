const {verifyToken} = require('../helpers/generateToken');

const checkAuth = async (req, res,next ) => {
    try {
        console.log(req.headers.authorization);
        const token = req.headers.authorization.split(' ').pop();
        const tokenData = await verifyToken(token); 
        console.log(tokenData);
        if(tokenData._id){
            next();
        }else{
            res.status(409).send("NO SESSION ACTIVE");
        }
    } catch (error) {
        console.log("TOKEN EXPIRED");
        res.status(409).send("TOKEN EXPIRED");
    }
}

module.exports = checkAuth;