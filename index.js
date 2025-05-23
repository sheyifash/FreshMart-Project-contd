const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Authentication = require("./model/AuthenticationModel")
const Category = require("./model/categoryModel")
const Product = require("./model/productModel")
const viewProductDetails = require("./controllers/viewProductDetails")
const placeOrder = require("./controllers/placeMultipleOrders")
const app = express()
const PORT = process.env.PORT || 4000
app.use(express.json())
mongoose.connect(process.env.MONGODB_URL)
.then( () => {
    console.log("mongodb connected....")
    app.listen(PORT, () => {
        console.log("PORT from .env:", process.env.PORT)
        console.log(`app is listening on ${PORT}`)
    })
})
//middleware to decode jwt and attach user
app.use((req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split(" ") [1]
        try {
            const user = jwt.verify(token, process.env.ACCESS_TOKEN)
            req.user = user
        } catch (error) {
            console.log("Invalid token")
        }
    }
    next()
})
//Role-check middleware
function checkRole(role) {
    return (req, res, next) => {
        if (!req.user || req.user.role !==role){
        return res.status(403).json({message: "Access denied"})
    }
    next()
}
}
app.post("/user-reg", async (request, response) => {
    try{
        const { firstName, lastName, country, LGA, userID, password, email, role} = request.body
        if (!email || !password || !role) {
            return response.status(400).json({message:"invalid email or password"})
        }
       const validPassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password)
        const hasLowerCase = /[a-z]/.test(password)
        const hasSpecialCharacter = /[~!@#$%^&*><.,";:+=]/.test(password)
        const hasMinLength = password.length >= 8

        if (!hasUpperCase) return "password must include an upperCase"
        if (!hasLowerCase) return "password must include at least one lowercase"
        if (!hasSpecialCharacter) return "password must include at least one specialcharacter"
        if (!hasMinLength) return "password must not be less than 8 digits"

        return null
       }
       const error = validPassword(password)
       if (error) {
        return response.status(400).json({error})
       }
       //checking for existing user
       const existingUser = await Authentication.findOne({email})
       if (existingUser) {
        return response.status(404).json("user already exists")
       }
       const hashedPassword = await bcrypt.hash(password, 12)
       const newUser = new Authentication({firstName, lastName, country, LGA, userID, password:hashedPassword, email, role})
       await newUser.save()
       response.status(201).json({message:"user account created successfully",
        newUser})
    }
    catch(error){
        response.status(500).json({message:error.message})
    }
})

app.post("/logIn", async (req, res) => {
   try {
    const { email, password} = req.body
    const user = await Authentication.findOne({email})//. select ("password"))
    if (!user) {
        return res.status(400).json("user account doesn't exist!")
    }
    const isMatch = await bcrypt.compare(password, user?.password)
    if (!isMatch) {
        return res.status(400).json("invalid email or password")
    }
const accessToken = jwt.sign(
   {id: user?._id, role:user.role},
    process.env.ACCESS_TOKEN,
    {expiresIn:"5m"}
)
const refreshToken = jwt.sign(
   {id: user?._id},
    process.env.REFRESH_TOKEN,
  {expiresIn:"30d"}
)
//generate token if ismatch is valid
res.status(200).json({
    message:"login successfully",
    accessToken,
    refreshToken,
    user
})
} catch (error) {
    res.status(500).json({message:error.message})
}
})
app.get("/admin-dashboard", checkRole("admin"), (req, res) => {
    res.send("Welcome, Admin!")
})
app.get("/", (req, res) => {
    res.send("Welcome!")
})
app.post("/create-category", async (req, res) => {
    const user = req.user
    if (user.role !== "admin"){
        return res.status(403).json({message:"Access denied"})
    }
    const { categoryName, manufacturerName, manufacturerCode} = req.body
    const newCategory = new Category({categoryName, manufacturerName, manufacturerCode})
    await newCategory.save()
    res.status(201).json({message:"successful",
        newCategory
    })
})
app.post("/create-product", async (req, res) => {
    try {
  /*const user = req.user
    if (user.role != "admin") {
    return res.status(403).json({message:"Access denied"})        
    }*/
const { productName, price, categoryName, productCode, image} = req.body
const newProduct = new Product({productName, price, categoryName, productCode, image})
await newProduct.save()
//console.log(newProduct)
res.status(201).json({message:"successful",
    newProduct})
   
    } catch (error) {
       res.status(500).json({message:error.message}) 
    }
})

app.get("/viewProduct/Details", viewProductDetails)
app.post("/place/order", placeOrder)