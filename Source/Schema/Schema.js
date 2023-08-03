require('dotenv').config()

const mongoose= require('mongoose')
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = new mongoose.Schema({

firstname:{
    type:String,
    required:true
},

lastname:{
    type: String,
    required:true
},

email:{
    type : String,
    unique: true,
    required:true
},

phone:{
    type: Number,
    unique:true,
    required:true
},

age:{
    type:Number,
    required:true
},

gender:{
    type: String,
    required:true
},

password:{
    type:String,
    required:true
},

confirmpassword:{
    type:String,
    required:true
},

tokens:[{token:{type:String,required:true}}]

})



//-----------------------------------------GENERATING TOKEN FOR AUTHENTICATION-------------------------------------------------------------------------------

User.methods.generateAuthToken=async function(){// whenever we are acessing function from a instance we do schemaname.methods.functioname

try{
console.log(this._id)

const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY) /// passing our id and the secret key to the jwt for token creation
// the secret key should be of 32 characters
this.tokens=this.tokens.concat({token:token})// adding the token to the array of tokens in the schema



await this.save() // the upper body of the function needs to excute first and then data should be saved

return token

}

catch(error){
res.send("error part : " + error)
console.log("error part : " + error)
}}

//-----------------------------------------GENERATING TOKEN FOR AUTHENTICATION-------------------------------------------------------------------------------






//-----------------------------------------HASHING THE PASSWORD----------------------------------------------------------------------------

User.pre('save',async function(next){// the pre function is used to take action before a event occurs
    // it takes 2 parameters: event and async function
if(this.isModified("password")){// hashing will be only done if password is modified

    console.log(`Pass before hash: ${this.password}`)

this.password=await bcrypt.hash(this.password,10);// hashing the password

console.log(` Pass after Hash:${this.password}`);

this.confirmpassword=await bcrypt.hash(this.password,10);// confirm pass is made undefined for more secure database

}

next()
})

//-----------------------------------------HASHING THE PASSWORD----------------------------------------------------------------------------




const Usercollection = new mongoose.model("Usercollection",User)


module.exports=Usercollection