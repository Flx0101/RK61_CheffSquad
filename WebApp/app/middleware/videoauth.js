const config = require('./../config/');
var middleware = require('./token');
const { ObjectId } = require('mongodb');
const MongoClient = require("mongodb").MongoClient;

let memberCheck = (req , res , next) => {
    //req.decoded = middleware.checkToken; \
    meetingURL = req.query.roomId;
    entireURL = config.host + req.url;
    console.log(meetingURL);
    console.log(entireURL);
    emailID = req.decoded.email;
    console.log(emailID);
    
    MongoClient.connect(config.dbURI , (err , client) => {
        client.db(config.dbName).collection(config.meetingColl).find({
            meetingUrl : entireURL
        })
        .toArray()
        .then((doc) =>  {

            console.log(doc)
            if (doc.length == 1){
                console.log(doc[0].caseId.toString());
                MongoClient.connect(config.dbURI , (err , client) => {
                    client.db(config.dbName).collection(config.casesColl).find(
                        
                            ObjectId(doc[0].caseId.toString())
                        ).toArray()
                    .then((doc1) => {
                    console.log(doc1[0].members.includes(emailID));
                    if(doc1[0].members.includes(emailID)){
                        return res.status(200).send({
                            "message" : "Authorized person added",
                            success : true
                        });
                        next();
                    }
                    else{
                        return res.status(401).send({
                            "message" : "Authorization Failed.Cannot join the meeting",
                            success : false
                        })
                    }

                    })
                    .catch((err) => console.log(err));
                });
            }
            else{
                return res.status(403).send({
                    "success" : false,
                    "message" : "failed"
                })
            }
        })
        .catch((err) => console.log(err));

    });
    
}

module.exports = {
    memberCheck : memberCheck
}