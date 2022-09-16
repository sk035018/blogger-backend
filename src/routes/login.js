const { compareHash } = require('../utils/bcrypt');
const { generateJWT } = require('../utils/jsonwebtoken');

const logInRouter = require('express').Router();

module.exports = (db) => {
    const userCollection = db.collection('users');
    logInRouter.route('/').post(async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await userCollection.findOne({ email });
            let token;
            if (user) {
                const isAuthenticated = await compareHash(password, user.password);
                if (isAuthenticated) {
                    token = generateJWT({ id: user._id });
                    res.json({ token });
                }
            }
            
            if (!user || !token) {
                res.json({ errMsg: 'Invalid Email or Password !!!' });
            }
        } catch (error) {
            console.log(error);
        }
    });

    return logInRouter;
};
