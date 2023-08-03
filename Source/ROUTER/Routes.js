const express = require('express')


const Router = new express.Router()






Router.get("/",(request,response)=>{
    response.render("index")
})

module.exports=Router