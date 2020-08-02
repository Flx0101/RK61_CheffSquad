const config = require('./../config/');
var middleware = require('./token');
const { ObjectId } = require('mongodb');
const MongoClient = require("mongodb").MongoClient;

let memberCheck = (req , res , next) => {

    //req.decoded = middleware.checkToken; \
    entireURL = config.host + req.url;
    console.log(entireURL);
    emailID = req.decoded.email;
    console.log(emailID);
    
    MongoClient.connect(config.dbURI , (err , client) => {
        client.db(config.dbName).collection(config.meetingColl).find({
            meetingURL : entireURL
        })
        .toArray()
        .then((doc) =>  {

            console.log(doc)
            if (doc.length == 1){
                if(doc[0].members.includes(emailID)){
                    return res.status(200).send({
                        "success" : true,
                        "message" : "Success : You are authorized"
                    })
                }
                else{
                    return res.status(403).send({
                        "success" : true,
                        "message" : "Not allowed"
                });
            }
        }
            else{
                return res.status(403).send({
                    "success" : false,
                    "message" : "failed"
                })
            }
        
    }).catch((err) => console.log(err));
    



});

    }

module.exports = {
    memberCheck : memberCheck
}