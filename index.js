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

const allowedOrigins = [
  "https://signin-frontend-virid.vercel.app",
  "https://stuffboxfrontend.vercel.app",
  "http://localhost:3000"
];

// ✅ Allow both local + deployed frontend
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for this origin"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests
app.options("*", cors());
// ✅ MongoDB connection
mongoose
  .connect(
    "mongodb+srv://shifaxoxo24_db_user:6QIadZxLOMv74MAU@cluster0.qgggsmz.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Database connection failed:", err.message));

// ✅ Test routes
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong 🏓" });
});

// ✅ MongoDB model (collection: bulkmail)
const credential = mongoose.model("credential", {}, "bulkmail");

// ✅ Send email route
app.post("/sendemail", async (req, res) => {
  try {
    const { msg, emailList } = req.body;

    if (!msg || !emailList?.length) {
      return res.status(400).json({ success: false, error: "Invalid input" });
    }

    // Fetch Gmail credentials from DB
    const creds = await credential.find();
    if (!creds.length) {
      return res
        .status(500)
        .json({ success: false, error: "No credentials found in DB" });
    }

    const gmailUser = creds[0].toJSON().user;
    const gmailPass = creds[0].toJSON().pass;

    console.log("📧 Using Gmail account:", gmailUser);

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass, // ⚠️ Must be an App Password (not normal Gmail password)
      },
    });

    // Send emails one by one
    for (let email of emailList) {
      console.log("➡️ Sending to:", email);
      await transporter.sendMail({
        from: gmailUser,
        to: email,
        subject: "Email from Bulkmailer App",
        text: msg,
      });
      console.log("✅ Sent to:", email);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Email send failed:", err);
    res
      .status(500)
      .json({ success: false, error: err.message, stack: err.stack });
  }
});

// ✅ Render-compatible port
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
