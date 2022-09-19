const _ = require('lodash');
const { ObjectId } = require('mongodb');
const { authenticate } = require('../middlewares/authenticate');

const blogsRouter = require('express').Router();

module.exports = (db) => {
    const blogsCollection = db.collection('blogs');
    const userCollection = db.collection('users');

    blogsRouter.route('/create').post(authenticate(userCollection), async (req, res) => {
        try {
            _.set(req.body, 'createdBy', ObjectId(req.user._id));
            const blog = await blogsCollection.insertOne(req.body);
            res.json(blog);
        } catch (error) {
            console.log(error);
        }
    });

    blogsRouter.route('/getAll').get(authenticate(userCollection), async (req, res) => {
        try {
            const { skip = 0, limit = 20 } = req.query;
            const blogs = await blogsCollection.aggregate([
                { $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'author'
                }},
                { $unwind: '$author'},
                { $project: { title: 1, subTitle: 1, body: 1, 'author.fullName': 1 }},
                { $skip: +skip },
                { $limit: +limit },
            ]).toArray();

            res.json(blogs);
        } catch (error) {
            console.log(error);
        }
    });

    blogsRouter.route('/getById/:id').get(authenticate(userCollection), async (req, res) => {
        try {
            const { id } = req.params;
            const blog = await blogsCollection.findOne({ _id: ObjectId(id) });
            res.json(blog);
        } catch (error) {
            console.log(error);
        }
    });

    blogsRouter.route('/update/:id').put(authenticate(userCollection), async (req, res) => {
        try {
            const { id } = req.params;
            const blog = await blogsCollection.findOne({ _id: ObjectId(id) });
            if (req.user._id !== blog.createdBy.toString()) {
                res.json({ errMsg: 'Can\'t update other\'s blog' });
            } else {
                _.unset(req.body, '_id');
                _.unset(blog, '_id');
                const updateBlog = await blogsCollection.replaceOne({ _id: ObjectId(id)}, { ...blog, ...req.body });
                res.json(updateBlog);
            }
        } catch (error) {
            console.log(error);
        }
    });

    blogsRouter.route('/delete/:id').delete(authenticate(userCollection), async (req, res) => {
        try {
            const { id } = req.params;
            const blog = await blogsCollection.findOne({ _id: ObjectId(id) });
            if (req.user._id !== blog.createdBy.toString()) {
                res.json({ errMsg: 'Can\'t delete other\'s blog' });
            } else {
                const deletedBlog = await blogsCollection.deleteOne({ _id: ObjectId(id) });
                res.json(deletedBlog);
            }
        } catch (error) {
            console.log(error);
        }
    });

    return blogsRouter;
};
