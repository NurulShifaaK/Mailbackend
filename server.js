// const express=require("express")
// const cors=require("cors")
// const nodemailer=require("nodemailer")
// const mongoose = require("mongoose")
// const app=express()
// app.use(express.json())
// // app.use(cors({
// //     origin: "https://stuffboxfrontend.vercel.app" ,
// //       methods: ["GET","POST"],
// //      credentials: true
// // }));

// app.use(cors());


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
// const PORT = process.env.PORT || 4001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Allow only your frontend
app.use(
  cors({
    origin: "https://stuffboxfrontend.vercel.app",
    methods: ["GET", "POST"],
  })
);

// ✅ Connect MongoDB
mongoose
  .connect(
    "mongodb+srv://shifaxoxo24_db_user:6QIadZxLOMv74MAU@cluster0.qgggsmz.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("✅ DB connected"))
  .catch(() => console.log("❌ DB connection failed"));

// ✅ Schema & Model
const credentialSchema = new mongoose.Schema(
  {
    user: String,
    pass: String,
  },
  { collection: "bulkmail" }
);

const Credential = mongoose.model("Credential", credentialSchema);

// ✅ Root check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Send Email API
app.post("/sendemail", async (req, res) => {
  try {
    const { msg, emailList } = req.body;
    if (!msg || !emailList || !Array.isArray(emailList)) {
      return res.json({ success: false, error: "Invalid input" });
    }

    // Get Gmail credentials from DB
    const creds = await Credential.findOne();
    if (!creds) {
      return res.json({ success: false, error: "No credentials found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: creds.user,
        pass: creds.pass, // Use Gmail App Password if 2FA enabled
      },
    });

    // Send emails one by one
    for (let i = 0; i < emailList.length; i++) {
      await transporter.sendMail({
        from: creds.user,
        to: emailList[i],
        subject: "Email from Bulkmailer App",
        text: msg,
      });
      console.log(`📨 Sent to ${emailList[i]}`);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.json({ success: false, error: err.message });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
