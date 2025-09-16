const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://shifaxoxo24_db_user:6QIadZxLOMv74MAU@cluster0.qgggsmz.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("✅ DB Connected"))
.catch(err => {
    console.error("❌ DB Error:", err.message);  // show main error
    console.error("Full error:", err);          // full details if needed
});
