const mongoose= require('mongoose')

mongoose.connect("mongodb://localhost:27017/USERSSAPI",
{useNewUrlParser:true,

useUnifiedTopology:true}) // This Is used for updating instanlty
.then(()=>console.log("CONNECTION ESTABLISHED"))
.catch(()=>console.log("CONNECTION LOST"))