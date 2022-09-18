const _ = require('lodash');
const { ObjectId } = require('mongodb');
const { authenticate } = require('../middlewares/authenticate');
const { createHash } = require('../utils/bcrypt');

const userRouter = require('express').Router();

module.exports = (db) => {
    const userCollection = db.collection('users');
    userRouter.route('/create').post(async (req, res) => {
        try {
            const { password } = req.body;
            req.body.password = createHash(password);
            const user = await userCollection.insertOne(req.body);
            res.json(user);
        } catch (error) {
            console.log(error);
        }
    });

    userRouter.route('/getAll').get(authenticate(userCollection), async (req, res) => {
        try {
            const { skip = 0, limit = 20 } = req.query;
            const response = await userCollection.find({}).project({ fullName: 1, dob: 1, email: 1 }).skip(+skip).limit(+limit).toArray();
            res.json(response);
        } catch (error) {
            console.log(error);
        }
    });

    userRouter.route('/getById/:id').get(async (req, res) => {
        try {
            const response = await userCollection.findOne({ _id: ObjectId(req.params.id) });
            res.json(response);
        } catch (error) {
            console.log(error);
        }
    });

    userRouter.route('/update/:id').put(authenticate(userCollection), async (req, res) => {
        try {
            if (req.params.id === req.user._id) {
                _.unset(req.body, 'password');
                _.unset(req.body, '_id');
                _.set(req.body, 'dob', new Date(req.body.dob));
                const userDetails = await userCollection.findOne({ _id: ObjectId(req.params.id) });
                _.unset(userDetails, '_id');
                const updateUser = await userCollection.replaceOne({ _id: ObjectId(req.params.id) }, { ...userDetails, ...req.body });
                res.json(updateUser);
            } else {
                res.json({ errMsg: 'Permission denied'});
            }
        } catch (error) {
            console.log(error);
        }
    });

    userRouter.route('/me').get(authenticate(userCollection), async (req, res) => {
        try {
            const response = await userCollection.findOne({ _id: ObjectId(req.user._id) });
            _.unset(response, 'password');
            res.json(response);
        } catch (error) {
            console.log(error);
        }
    });

    return userRouter;
};
