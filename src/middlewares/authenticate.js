const _ = require('lodash');
const { ObjectId } = require('mongodb');
const { parseToken } = require('../utils/jsonwebtoken');

const authenticate = (userCollection) => async (req, res, next) => {
    try {
        const { headers: { authorization }} = req;
        const { id } = (await parseToken(authorization)) || {};
        let user;
        if (id) {
            user = await userCollection.findOne({ _id: ObjectId(id) });
            if (user) {
                _.set(user, '_id', id);
                _.unset(user, 'password');
                req.user = user;
                next();
            }
        }

        if (!id || !user) {
            res.json({ errMsg: 'Unauthorized' });
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    authenticate,
}