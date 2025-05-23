const express = require("express")
const mongoose = require("mongoose")
const Product = require("../model/productModel")
const Order = require("../model/orderModel")
const placeOrder = async (req, res) => {
   try{
 const {user, products, shippingAddress, paymentMethod, paymentStatus, orderStatus} = req.body
if (!products||products.length == 0) {
    return res.status(400).json("please select desired products")
}
const orderedProduct = await Promise.all(products.map(async (product) => {
    const newOrder = await Product.findOne({name:product.productName}) 
    if (!newOrder) {
        throw new Error("Product not found");
    }
    return {
        product:product.productName,
        quantity:product.quantity,
        price:product.price
    }

}))
const order = new Order({
user,
products,
shippingAddress,
paymentMethod,
paymentStatus,
orderStatus,
//subTotalAmount,
//shippingCost,
//packagingFee,
//grandTotal
})
await order.save
res.status(201).json({message:"Order successful",
    order
})}
catch (error){
res.status(500).json({message:error.message})
}
}
module.exports = placeOrder