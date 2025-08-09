const mongoose=require("mongoose")
const userSchema=mongoose.Schema({
    
    email:{
        type:String,
        reqiured:true,
        unique:true
    },password:{
type:String,
required:true,

    }

},{timeStamps:true})

module.exports=mongoose.module("User" ,userSchema)