const mongoose = require('mongoose');
const { usersModel: Users, usersSchema } = require("../models/usersModel")
require('dotenv').config()

function connect(objConnect) {

    const uri = `mongodb+srv://NormalAccess:${process.env.DB_PASSWORD}@cluster0-hrloc.mongodb.net/test?retryWrites=true&w=majority`

    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "Helio"
    });
    


} // end of connect function

function close() {

    mongoose.connection.close()
}

function create(objCreate) {

    let serial = {}

    console.log(objCreate.doc)
    // use the schema as a template to check for properties in document to write
    // if the document has a matching property copy it to new object
    // write the new object
    for (let key in usersSchema) {
        if (objCreate.doc.hasOwnProperty(key)) {
            serial[key] = objCreate.doc[key]
        }
    }

    console.log(usersSchema)
    console.log(serial)
    // don't need to call .exec() create returns a promise
    return Users.create(serial)

}

function readAll(objRead) {
    return Users.find().exec()
}

function readOne(objRead) {

    return Users.findById(objRead.id).exec()

}

function findOne(objFind) {

    return Users.findOne(objFind.query).exec()
}

function update(objUpdate) {

    let serial = {}
    for (let key in usersSchema) {
        if (objUpdate.doc.hasOwnProperty(key)) {
            serial[key] = objUpdate.doc[key]
        }
    }

    return Users.updateOne({_id: objUpdate.id}, serial).exec()

}

function replace(objReplace) {

    let serial = {}
    for (let key in usersSchema) {
        if (objReplace.doc.hasOwnProperty(key)) {
            serial[key] = objReplace.doc[key]
        }
    }
    console.log(serial)
    return Users.replaceOne({_id: objReplace.id},serial).exec()

}

// cant use delete as a function name 
// because it is a js keyword
function del(objDelete) {

    return Users.deleteOne({_id: objDelete.id}).exec()

}

module.exports.connect = connect
module.exports.close = close
module.exports.create = create
module.exports.readOne = readOne
module.exports.readAll = readAll
module.exports.update = update
module.exports.replace = replace
module.exports.findOne = findOne
module.exports.del = del