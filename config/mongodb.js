import mongojs from "mongojs";

const databaseUrl = 'mongodb://angularku1:angularku1@ds061464.mlab.com:61464/mynote';
const collections = ['note_detail', 'user_detail'];

const connect = mongojs(databaseUrl, collections);

module.exports = {
    connect: connect
};