const jwt = require('jsonwebtoken');

const CLIENT_SECRET = process.env.CLIENT_SECRET;

const generateJWT = payload => {
    return jwt.sign(payload, CLIENT_SECRET);
};

const parseToken = async token => {
    return await jwt.verify(token, CLIENT_SECRET);
};

module.exports = {
    generateJWT,
    parseToken,
}
