import {MongoClient} from "mongodb";

const databaseUrl = 'mongodb://angularku1:angularku1@ds061464.mlab.com:61464/mynote';
const collections = {note_detail: 'note_detail', user_detail: 'user_detail'};


MongoClient
    .connect(databaseUrl)
    .then(connection => {

        // THIS WILL NOT WORK AS EXPECTED!!!
        module.exports = connection;
    });