const routes = require("express").Router();
var nodemailer = require('nodemailer');




routes.get("/sendMail" , (req , res , next) => {
	console.log("asd");
	

const nodemailer = require('nodemailer'); 
  
  
let mailTransporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
        user: 'amamsingh1407@gmail.com', 
        pass: 'Sih@2020'
    } 
}); 
  
let mailDetails = { 
    from: 'amamsingh1407@gmail.com', 
    to: 'sihtesting74@gmail.com', 
    subject: 'Test mail', 
    text: 'Node.js testing mail for GeeksforGeeks'
}; 
  
mailTransporter.sendMail(mailDetails, function(err, data) { 
    if(err) { 
        console.log('Error Occurs'); 
    } else { 
        console.log('Email sent successfully'); 
    } 
}); 


	console.log("asdbo");
});

module.exports = routes;
