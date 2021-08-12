const express = require("express");
const ejs = require("ejs")
const bodyParser = require("body-parser");
let alert = require('alert'); 
//const mongoose = require("mongoose");

const app = express(); 

let usersData = [
   { id:1001, name:"Ali", balance:357000 },
   { id:2002, name:"Adil", balance:277000 },
   { id:3003, name:"Zohaib", balance:152000 },
   { id:4004, name:"Saim", balance:451000 },
   { id:5005, name:"Hafeez", balance:555000 },
   { id:6006, name:"Haris", balance:677000 },
   { id:7007, name:"Junaid", balance:997000 },
   { id:8008, name:"Zake", balance:7000 },
   { id:9009,  name:"Memom", balance:217000 },
   { id:1010, name:"Aqsa", balance:117000 }
];

let transactionsDetails = [];

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))

app.get('/home',(req,res)=>{
    res.render("home")
});


app.get('/users',(req,res)=>{
  res.render("users", {usersData:usersData});
});

app.get('/moneytransfer',(req,res)=>{
  res.render("moneytransfer");
});

app.get('/transactions',(req,res)=>{
  res.render("transactions",{transactionsDetails:transactionsDetails});
});

app.post("/moneytransfer", (req,res) => {
  
     let obj = {
       senderId : req.body.senderId,
       senderName : " ",
       recieverId : req.body.recieverId,
       recieverName: " ",
       amountSent : req.body.amountSent,
       transferDate : Date()
     }
      console.log(obj.senderId + " | " + obj.recieverId + " | " + obj.amountSent);
    
      
   
     
      for (let i = 0 ; i<usersData.length ; i++){
          if ( usersData[i].id == obj.recieverId) {
             for (let j = 0 ; j<usersData.length ; j++){
                 if (usersData[j].id == obj.senderId ) {
                       if (( usersData[j].balance >= obj.amountSent) && (obj.amountSent > 0)){
                                usersData[j].balance -= obj.amountSent;
                                obj.senderName = usersData[j].name;
                                usersData[i].balance += parseInt(obj.amountSent);
                                obj.recieverName = usersData[i].name;
                                transactionsDetails.push(obj);
                                alert("Transfer Successful.");
                                break;
                                
                       } else {
                         alert("Tranasfer Unsuccessful. Please Try Again.");
                         break;
                       }
                 }
             }
           } 
      } 
      obj = {};
});

app.listen(3000,()=>{
    console.log("server at port 3000");
  })