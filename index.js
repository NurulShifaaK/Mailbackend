// const express=require("express")
// const cors=require("cors")
// const nodemailer=require("nodemailer")
// const mongoose = require("mongoose")
// const app=express()
// app.use(express.json())
// app.use(cors({
//     origin: "https://stuffboxfrontend.vercel.app" 
// }));




// mongoose.connect("mongodb+srv://shifaxoxo24_db_user:6QIadZxLOMv74MAU@cluster0.qgggsmz.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function(){
//     console.log("db sucess")
// }).catch(function(){
//     console.log("db failed")
// })

// app.get("/", (req, res) => {
//   res.send("Backend is running");
// });

// const credential=mongoose.model("credential",{},"bulkmail")


// app.post("/sendemail",function(req,res){
//  var msg=req.body.msg
//  var emailList=req.body.emailList

// credential.find()
// .then(function(data)
// {
//     const transporter = nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//         user:data[0].toJSON().user,
//         pass:data[0].toJSON().pass,
//     },
// })

//  new Promise(async function(resolve,reject){
//      try{
 
//  for(var i=0;i<emailList.length;i++)
//  {
//    await transporter.sendMail(
//     {
//        from:"nurulshifaak@gmail.com",
//        to:emailList[i],
//        subject:"email from bulkmailer app",
//        text:msg
       
//     },
    
// )
// console.log("sucess")
//  }


//  resolve("sucess")
// }
// catch(error){
//    reject("failed")
// }

//  }).then(function(){
//     res.send(true)
//  }).catch(function(){
//     res.send(false)
//  })

// })
// .catch(function(error){
//     console.log(error)
// })



// })
// app.listen(4001,function(){
//     console.log("shifaa server started in port 4001")
// })


const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Allow both local and deployed frontend
app.use(
  cors({
    origin: ["http://localhost:3000", "https://stuffboxfrontend.vercel.app"],
  })
);

// ✅ MongoDB connection
mongoose
  .connect(
    "mongodb+srv://shifaxoxo24_db_user:6QIadZxLOMv74MAU@cluster0.qgggsmz.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(function () {
    console.log("✅ Database connected");
  })
  .catch(function (err) {
    console.error("❌ Database connection failed:", err.message);
  });

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Test route
app.get("/ping", (req, res) => {
  res.json({ message: "pong 🏓" });
});

// MongoDB model (using "bulkmail" collection)
const credential = mongoose.model("credential", {}, "bulkmail");

// Send email route
app.post("/sendemail", async (req, res) => {
  try {
    const { msg, emailList } = req.body;
    if (!msg || !emailList?.length) {
      return res.status(400).json({ success: false, error: "Invalid input" });
    }

    const creds = await credential.find();
    if (!creds.length) {
      return res.status(500).json({ success: false, error: "No credentials found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: creds[0].toJSON().user,
        pass: creds[0].toJSON().pass,
      },
    });

    for (let email of emailList) {
      await transporter.sendMail({
        from: "nurulshifaak@gmail.com",
        to: email,
        subject: "Email from bulkmailer app",
        text: msg,
      });
      console.log("✅ Sent to:", email);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Email send failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Render-compatible port
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
