const getUserRouter = require('./user');
const getLogInRouter = require('./login');
const getBlogRouter = require('./blogs');

module.exports = (app, db) => {
    app.use('/user', getUserRouter(db));
    app.use('/login', getLogInRouter(db));
    app.use('/blog', getBlogRouter(db));
};