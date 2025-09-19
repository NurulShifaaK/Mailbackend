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




// ------------------------
//  Import dependencies
// ------------------------
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ------------------------
//  CORS – allow your frontend only
// ------------------------
app.use(
  cors({
    origin: "https://stuffboxfrontend.vercel.app",
    methods: ["GET", "POST"],
  })
);

// ------------------------
//  MongoDB Connection
// ------------------------
mongoose
  .connect(
    // replace with your own Mongo URI or keep as is if already valid
    "mongodb+srv://<username>:<password>@cluster0.qgggsmz.mongodb.net/passkey?retryWrites=true&w=majority"
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB connection failed:", err));

// ------------------------
//  Schema & Model
// ------------------------
const credentialSchema = new mongoose.Schema(
  {
    user: String, // Gmail address
    pass: String, // Gmail App Password
  },
  { collection: "bulkmail" }
);

const Credential = mongoose.model("Credential", credentialSchema);

// ------------------------
//  Health Check Route
// ------------------------
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ------------------------
//  Send Email Route
// ------------------------
app.post("/sendemail", async (req, res) => {
  try {
    const { msg, emailList } = req.body;

    if (!msg || !emailList || !Array.isArray(emailList)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid input format" });
    }

    // Fetch first Gmail credential document
    const creds = await Credential.findOne();
    if (!creds) {
      return res
        .status(500)
        .json({ success: false, error: "No email credentials found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: creds.user,
        pass: creds.pass, // Gmail App Password recommended
      },
    });

    // Send each email sequentially (can be optimized with Promise.all)
    for (const recipient of emailList) {
      await transporter.sendMail({
        from: creds.user,
        to: recipient,
        subject: "Email from Bulkmailer App",
        text: msg,
      });
      console.log(`📨 Sent to ${recipient}`);
    }

    res.json({ success: true, sent: emailList.length });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------------
//  Start Server
// ------------------------
const PORT = process.env.PORT || 4001; // Render provides PORT
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
