const mongoose = require("mongoose")
const categorySchema = new mongoose.Schema({
    categoryName:{type:String, required:true},
    manufactureName:{type:String, required:true},
    manufacturerCode:{type:Number, required:true}
}, {timestamps: true})
const Category = new mongoose.model("Category", categorySchema)

module.exports = Category