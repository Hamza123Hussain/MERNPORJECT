require('dotenv').config()
const express= require('express')
const app = new express()
const path = require('path')
const hbs= require('hbs')
require('./DATABASE/Connection')

// const Router = require('./ROUTER/Routes')

const User = require('./Schema/Schema')

// const Static_Path= path.join(__dirname,'../Public')
// app.use(express.static(Static_Path))

const Views_Path=path.join(__dirname,"../Templates/Views")

const Partial_Path=path.join(__dirname,"../Templates/Partials")


console.log(process.env.SECRET_KEY)
 

app.set("view engine","hbs")
app.set('views',Views_Path)
hbs.registerPartials(Partial_Path)


app.get("/",(request,response)=>{
    response.render("index")
})

app.get("/register",(request,response)=>{
    response.render("register")
})
app.use(express.urlencoded({extended:false})) // use for displaying data of the form

app.post("/register",async(request,response)=>{
    try{

const password= request.body.password
const confirmpassword= request.body.confirmpassword

if(password===confirmpassword){

const registeruser = new User({    // entering the data entered in the form to the database as a document 
    firstname:request.body.firstname ,
    lastname : request.body.lastname,
    email:request.body.email,
    phone:request.body.phone,
    age:request.body.age,
    gender:request.body.gender,
    password:request.body.password,
    confirmpassword:request.body.confirmpassword
    })


console.log("The sucess part : "+ registeruser)

const token = await registeruser.generateAuthToken(); /// This function is defined here but will be excuted in the schema
console.log( "TOKEN : " + token); // this token is used for user authentication

const save = await registeruser.save() // saving the data entered in the form to the database as a document 

console.log("PAGE PART : "+ registeruser)

response.status(201).send(registeruser)

}
else{
    response.send("paassword no match")
}
    }

    catch{
        response.status(401).send("EMAIL OR PHONE NEEDS TO BE A UNQIUE VALUE")
    }
})



app.get("/login",(request,response)=>{
    response.render("login")
})

app.post('/login',async(request,response)=>{

    try{
    const email= request.body.email; 
    const password= request.body.password;
    const UserDetails= await User.findOne({email:email}) // Attaining The Record that has details of the gieven email

const Match = await bcrypt.compare(password,UserDetails.password) // this will check if the password entered at login is equal to the hash value in the database

const token = await UserDetails.generateAuthToken(); // This will get the token value fo the relevent user

console.log("TOKEN : " +token)


    if(Match){ // if password matches the record in the database then sucess
    response.status(201).send(UserDetails)

}
else{
    response.status(503).send('Invalid LOGIN DETAILS')
}


}

catch{
    response.status(503).send('Invalid ')  
}

}





)


app.listen(8000,()=>{
    console.log("Server is running on port 8000")
})





//--------------------------------------------SOME IMPORTANT CONCEPTS BELOW----------------------------------------------------------------------





//HASHING PASSWORD FOR SECURETY
const bcrypt= require('bcryptjs')

const securepass=async(password)=>{


const Hashing= await bcrypt.hash(password,10) // This will convert the given password into a hash
// 10 is the salt value. if salt value =8 then it takes 160 days to hack , if 12 then it takes 3 years to hack,
// we need to use 10 value as it takes abundant time to hack it and also does not take time loading the site

console.log(Hashing)

const Match = await bcrypt.compare("haniahotty",Hashing)// This will compare the given password with hash
// if both same then true will be returned

console.log(Match)




}

//securepass("haniahotty")







//COOKIES AND VERIFICATION TOKENS

const jwt= require('jsonwebtoken') // this is a token that helps in autheicating a user
const createtoken=async()=>{
    const token= await jwt.sign({_id:"12aqwerftgsazcyi68k6j53"},"mynameishamzahussainandiamasuper",{ // to create tokeb we need a id and a secret key
        expiresin:"5 minutes" // also add a expiry for the token
    });

    console.log(token)


const userver= await jwt.verify(token,"mynameishamzahussainandiamasuper") // you can attain the id and signature via the verify property. The secret key should be same
console.log(userver)
}

// createtoken();


