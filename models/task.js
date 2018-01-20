import bcrypt from "bcrypt";
var ObjectID = require('mongodb').ObjectID;

class Task {
    constructor(connection){
        this._connection = connection();
    }

    saveTask(task){
        this._connection.open((err, mongoClient) => {
            mongoClient.collection("tasks", (err, db) => {

                if(err) throw err;

                db.insert(task, function(err, res){
                    if(err) throw err;
                });

                mongoClient.close();
            });
        });
    }

    getTaskByID(id){
        return new Promise((resolve, reject) => {
            this._connection.open((err, mongoClient) => {
                mongoClient.collection("tasks", (err, db) => {
    
                    if(err){
                        reject(err);
                    }

                    db.find({user_id: id}).toArray(function(err, result){
                        if(err){reject(err)};
                        resolve(result);
                    });
    
                    mongoClient.close();
                });
            });
        });
    };

    deleteTask(id){
        return new Promise((resolve, reject) => {
            this._connection.open((err, mongoClient) => {
                mongoClient.collection("tasks", (err, db) => {
    
                    if(err){
                        reject(err);
                    }

                    db.remove({_id: new ObjectID(id)}, (err, result) => {
                        if(err){reject(err)};
                        resolve(result);
                    });
    
                    mongoClient.close();
                });
            });
        });
    };

}

const task = module.exports = Task;