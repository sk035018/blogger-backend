require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongodb = require('./src/db/conn');
const setRouter = require('./src/routes');

const SERVER_PORT = process.env.SERVER_PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongodb.connectToServer((err, db) => {
    if (err) {
        console.log('Error in DB Connection', err);
    } else {
        app.get('/', (_, res) => { res.send('Welcome to dummy project') });
        
        setRouter(app, db);
        
        app.listen(SERVER_PORT, () => {
            console.log(`Server started at port ===> ${SERVER_PORT}`);
        });
    }
});
