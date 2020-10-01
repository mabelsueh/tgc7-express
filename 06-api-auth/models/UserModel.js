const MongoUtil = require('../MongoUtil');
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require('bcryptjs');
const USER_COLLECTION = "users";

async function createUser(name, email, password) {

    let salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    let db = MongoUtil.getDB();
    let result = await db.collection(USER_COLLECTION).insertOne({
        name, email, password
    });
    return result.insertedId;
}

async function findUserById(userid) {
    let db = MongoUtil.getDB();
    let user = await db.collection(USER_COLLECTION).findOne({
        '_id': ObjectId(userid)
    })
    return user;
}

async function findUserByEmail(email) {
    let db = MongoUtil.getDB();
    let user = await db.collection(USER_COLLECTION).findOne({
        'email': email
    })
    return user;
}

module.exports = {
    createUser, findUserById, findUserByEmail
};