const config = require('./../config/');
var middleware = require('./token');
const { ObjectId } = require('mongodb');
const MongoClient = require("mongodb").MongoClient;

let memberCheck = (req , res , next) => {

    //req.decoded = middleware.checkToken; \
    entireURL = req.url;

    entireURL = req.protocol + '://' + req.get('host') + entireURL.split("&",1)[0];
    var fullUrl =  + req.originalUrl;
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
                    
                    next();
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