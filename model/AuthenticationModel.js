const mongoose = require("mongoose")
const authenticationSchema = new mongoose.Schema({
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    country:{type:String, required:true},
    LGA:{type:String, required:true},
    email:{type:String, required:true},
    userID:{type:String, required:true},
    password:{type:String, required:true}
},{timestamps:true})
const Authentication = new mongoose.model("Authentication", authenticationSchema)
module.exports = Authentication