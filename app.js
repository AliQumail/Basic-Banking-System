const express = require("express");
const ejs = require("ejs")
const bodyParser = require("body-parser");
let alert = require('alert'); 
let mongoose = require('mongoose');

const app = express(); 

let mongoDB = 'mongodb://localhost:27017/bankDB';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let Schema = mongoose.Schema;

let usersDataSchema = new Schema({
  id : Number,
  name : String,
  balance : Number
});

let usersDataDB = mongoose.model("usersDataDB", usersDataSchema);

let transactionsDetailsSchema = new Schema({
  senderId : Number,
  senderName : String,
  recieverId : Number,
  recieverName: String,
  amountSent : Number,
  transferDate : String
});

let transactionsDetailsDB = mongoose.model("transactionsDetailsDB", transactionsDetailsSchema);



// let usersData = [
//    { id:1001, name:"Ali", balance:357000 },
//    { id:2002, name:"Adil", balance:277000 },
//    { id:3003, name:"Zohaib", balance:152000 },
//    { id:4004, name:"Saim", balance:451000 },
//    { id:5005, name:"Hafeez", balance:555000 },
//    { id:6006, name:"Haris", balance:677000 },
//    { id:7007, name:"Junaid", balance:997000 },
//    { id:8008, name:"Zake", balance:7000 },
//    { id:9009,  name:"Memom", balance:217000 },
//    { id:1010, name:"Aqsa", balance:117000 }
// ];

// for (let i = 0 ; i<usersData.length ; i++){
//    let userDataInstance = new usersDataDB({
//      id: usersData[i].id,
//      name: usersData[i].name,
//      balance : usersData[i].balance
//    });
//    userDataInstance.save(function (err) {
//     if (err) return handleError(err);
//   });
// }

let transactionsDetails = [];

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))

app.get('/home',(req,res)=>{
    res.render("home")
});


app.get('/users',(req,res)=>{
  usersDataDB.find({},(err,usersData)=>{
    res.render("users",{ usersData : usersData})
  });
});



app.get('/moneytransfer',(req,res)=>{
  res.render("moneytransfer");
});

app.get('/transactions',(req,res)=>{
 transactionsDetailsDB.find({},(err,transactionsDetails)=>{
     res.render("transactions",{transactionsDetails:transactionsDetails});
  });
});



  



app.post("/moneytransfer", async (req,res) => {
  
      let obj = {
       senderId : req.body.senderId,
       senderName : " ",
       recieverId : req.body.recieverId,
       recieverName: " ",
       amountSent : req.body.amountSent,
       transferDate : Date()
     }
      console.log(obj.senderId + " | " + obj.recieverId + " | " + obj.amountSent);
     
      let senderDetails,recieverDetails;
      await usersDataDB.findOne({ id: obj.senderId },function(err, details){
         if ( details ){
         
          senderDetails = details;
        } else {
          console.log("No Value Found");
        }
      });
      

     await usersDataDB.findOne({ id: obj.recieverId }, async function(err, details){
        if ( details ){
          
          recieverDetails = details;
        } else {
          console.log("No Value Found");
        }
      });
      
      if ( recieverDetails && senderDetails ) {
         if (obj.amountSent <= senderDetails.balance ){
           obj.senderName = recieverDetails.name;
           obj.recieverName = senderDetails.name;
           senderDetails.balance -= obj.amountSent;
           recieverDetails.balance += parseInt(obj.amountSent);
           console.log("success");
           alert("Successful transfer")
         } else {
          console.log("un-success");
           alert("Unsuccessful transfer. Please try again");
         }
      } 
    
     console.log(senderDetails);
     console.log(recieverDetails);
      
    const filter1 = { id : senderDetails.id} ;
    const filter2 = { id : recieverDetails.id }; 
    const update1 = { balance : senderDetails.balance };
    const update2 = { balance : recieverDetails.balance };
    await usersDataDB.findOneAndUpdate(filter1,update1);
    await usersDataDB.findOneAndUpdate( filter2,update2);
     
    console.log(obj);

    let transactionsDetailsInstance = new transactionsDetailsDB({
        senderId : obj.senderId,
        senderName : obj.senderName,
        recieverId : obj.recieverId,
        recieverName: obj.recieverName,
        amountSent : obj.amountSent,
        transferDate : obj.transferDate
    });
    transactionsDetailsInstance.save(function (err) {
       if (err) return handleError(err);
    });
});

app.listen(3000,()=>{
    console.log("server at port 3000");
  })


