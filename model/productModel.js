const mongoose = require("mongoose")
const productSchema = new mongoose.Schema({
    productName:{type:String, required:true},
    categoryName:{type:String, required:true},
    price:{type:Number, required:true},
    productCode:{type:Number, required:true},
    image:{type:String, default:""}
}, {timestamps:true})
const Product = new mongoose.model("Product", productSchema)
module.exports = Product