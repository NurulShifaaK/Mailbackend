const express=require("express")
const cors=require("cors")
const nodemailer=require("nodemailer")
const mongoose = require("mongoose")
const app=express()
app.use(express.json())
// app.use(cors({
//     origin: "https://stuffboxfrontend.vercel.app" ,
//       methods: ["GET","POST"],
//      credentials: true
// }));

app.use(cors());


mongoose.connect("mongodb+srv://shifaxoxo24_db_user:6QIadZxLOMv74MAU@cluster0.qgggsmz.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function(){
    console.log("db sucess")
}).catch(function(){
    console.log("db failed")
})

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const credential=mongoose.model("credential",{},"bulkmail")


app.post("/sendemail",function(req,res){
 var msg=req.body.msg
 var emailList=req.body.emailList

credential.find()
.then(function(data)
{
    const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:data[0].toJSON().user,
        pass:data[0].toJSON().pass,
    },
})

 new Promise(async function(resolve,reject){
     try{
 
 for(var i=0;i<emailList.length;i++)
 {
   await transporter.sendMail(
    {
       from:"nurulshifaak@gmail.com",
       to:emailList[i],
       subject:"email from bulkmailer app",
       text:msg
       
    },
    
)
console.log("sucess")
 }


 resolve("sucess")
}
catch(error){
   reject("failed")
}

 }).then(function(){
    res.send(true)
 }).catch(function(){
    res.send(false)
 })

})
.catch(function(error){
    console.log(error)
})



})
app.listen(4001,function(){
    console.log("shifaa server started in port 4001")
})