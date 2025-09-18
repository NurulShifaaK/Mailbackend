// const express=require("express")
// const cors=require("cors")
// const nodemailer=require("nodemailer")
// const mongoose = require("mongoose")
// const app=express()
// app.use(express.json())
// app.use(cors({
//     origin: "https://stuffboxfrontend.vercel.app" ,
//       methods: ["GET","POST"],
//      credentials: true
// }));

// // app.use(cors());


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

// ✅ Allow your frontend

app.use(
  cors({
    origin: [
      "https://stuffboxfrontend.vercel.app", // your deployed frontend
      "http://localhost:3000",               // for local testing
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ Test CORS quickly
app.options("*", cors());

// ✅ Connect MongoDB
mongoose
  .connect(
    "mongodb+srv://shifaxoxo24_db_user:6QIadZxLOMv74MAU@cluster0.qgggsmz.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("✅ DB connected"))
  .catch((err) => console.error("❌ DB failed:", err));

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Schema (using existing collection "bulkmail")
const credential = mongoose.model("credential", {}, "bulkmail");

// ✅ Send Email API
app.post("/sendemail", async (req, res) => {
  try {
    const { msg, emailList } = req.body;

    if (!msg || !emailList || emailList.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Message and email list required" });
    }

    // Fetch email credentials from DB
    const data = await credential.find();
    if (!data || data.length === 0) {
      return res
        .status(500)
        .json({ success: false, message: "No credentials found in DB" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass,
      },
    });

    // Send emails one by one
    for (let i = 0; i < emailList.length; i++) {
      await transporter.sendMail({
        from: "nurulshifaak@gmail.com",
        to: emailList[i],
        subject: "email from bulkmailer app",
        text: msg,
      });
      console.log(`📩 Sent to: ${emailList[i]}`);
    }

    return res.json({ success: true, message: "Emails sent successfully" });
  } catch (error) {
    console.error("❌ Error sending emails:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send emails" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
