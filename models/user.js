import bcrypt from "bcrypt";
var ObjectID = require('mongodb').ObjectID;

class User {
    constructor(connection){
        this._connection = connection();
    }

    saveUser(user){
        this._connection.open((err, mongoClient) => {
            mongoClient.collection("users", (err, db) => {

                if(err) throw err;

                const salt = bcrypt.genSaltSync();
                user.password = bcrypt.hashSync(user.password, salt);

                db.insert(user);

                mongoClient.close();
            });
        });
    }

    getUserByID(id){
        return new Promise((resolve, reject) => {
            this._connection.open((err, mongoClient) => {
                mongoClient.collection("users", (err, db) => {
    
                    if(err){
                        reject(err);
                    }

                    db.find({_id: new ObjectID(id)}).toArray(function(err, result){
                        if(err){reject(err)};
                        resolve(result);
                    });
    
                    mongoClient.close();
                });
            });
        });
    }

    getUser(email){
        return new Promise((resolve, reject) => {
            this._connection.open((err, mongoClient) => {
                mongoClient.collection("users", (err, db) => {
    
                    if(err){
                        reject(err);
                    }

                    db.find({email: email}).toArray(function(err, result){
                        if(err){reject(err)};
                        resolve(result);
                    });
    
                    mongoClient.close();
                });
            });
        });
    }

    deleteUser(id){
        return new Promise((resolve, reject) => {
            this._connection.open((err, mongoClient) => {
                mongoClient.collection("users", (err, db) => {
    
                    if(err){
                        reject(err);
                    }

                    db.deleteOne({_id: new ObjectID(id)}, function(err, obj){
                        if(err){reject(err)};
                        resolve(obj);
                    });
    
                    mongoClient.close();
                });
            });
        });
    }
}

const user = module.exports = User;