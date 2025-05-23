const express = require ("express")
const mongoose = require("mongoose")
const Product = require("../model/productModel")
const viewProductDetails = async (req, res) => {
try {
    const {productName} = req.params
const productDetails = await Product.findOne({name:productName})
if (!productDetails) {
    return res.status(400).json("Not found")
}
const {name, categoryName, price, productCode} = productDetails
res.status(200).json({product:{productName, categoryName, price, productCode}})
}  
catch (error) {
    res.status(500).json({message:error.message})
}}
module.exports = viewProductDetails