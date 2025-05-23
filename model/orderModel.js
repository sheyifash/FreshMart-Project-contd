const mongoose = require ("mongoose")
const Product = require("./productModel")
const orderProductSchema = new mongoose.Schema({
Product:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Product",
    required: true
},
quantity:{
    type: Number, required:true,
},
price:{
    type:Number, required:true
}
})

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Authentication",
        required:true
    },
    products:[orderProductSchema],
    shippingAddress:{
        address:{
            type:String, required:true
        },
        city:{
            type:String, required:true
        },
        state:{type:String, required:true},
        country:{
            type:String, required:true
        }
    },
    paymentMethod:{
        type:String, required:true, enum:["cash", "card payment", "USSD", "transfer"]
    },
    paymentStatus:{
        type:String, required:true, enum:["pending", "failed", "successful"]
    },
    orderStatus:{
        type:String, required:true, enum:["pending", "counfirmed", "Out for delivery", "delivered"]
    },
    subTotalAmount:{type:Number, required:true, default:0},
    shippingCost:{type:Number, required:true, default:0},
    packagingFee:{type:Number, required:true, default:0},
    grandTotal:{type:Number, required:true, default:0}
})
orderSchema.pre("save", function (next) {
    const subTotalAmount = this.products.reduce((total, product) => {
        return total + product.price * product.quantity
    }, 0)
    let shippingCost =  0
    let packagingFee = 0

    this.subTotalAmount = subTotalAmount
    this.shippingCost = shippingCost
    this.packagingFee = packagingFee
    this.grandTotal = subTotalAmount + shippingCost + packagingFee
next()
})
const Order = new mongoose.model("Order", orderSchema)
module.exports = Order