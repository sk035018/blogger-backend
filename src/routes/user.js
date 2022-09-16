const { ObjectId } = require('mongodb');
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

    userRouter.route('/getAll').get(async (req, res) => {
        try {
            const response = await userCollection.find({}).limit(50).toArray();
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

    userRouter.route('/update/:id').put(async (req, res) => {
        try {
            delete req.body.password;
            req.body.dob = new Date(req.body.dob);
            const userDetails = await userCollection.findOne({ _id: ObjectId(req.params.id) });
            const updateUser = await userCollection.replaceOne({ _id: ObjectId(req.params.id) }, { ...userDetails, ...req.body });
            res.json(updateUser);
        } catch (error) {
            console.log(error);
        }
    })

    return userRouter;
};
