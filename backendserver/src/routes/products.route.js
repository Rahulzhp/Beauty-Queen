const express=require("express")
const adminAuth = require("../middlewares/adminAuth")
const Product = require("../models/products.model")

const app=express.Router()


app.get("/", async (req, res) => {
    let products = await Product.find()
    try {
        if(products){
            res.send(JSON.stringify(products))
        } else {
            res.send("product not found")
        }
    } catch (e) {
        res.send(e.message)
    }
})


app.post("/", adminAuth , async (req, res) => {
    const {name, category, description, image, price, ofPrice, quantity} = req.body
    
    try {
        let existing = await Product.findOne({name,image})
        if(existing){
           let prod = await Product.findOneAndUpdate({name},{quantity:existing.quantity++},{new:true})
           res.send("Product updated successfully")
        } else {
            let pro = await Product.create({
                name, category, description, image, price, ofPrice, quantity
            })
            res.send("product added successfully")
        }
    } catch (e) {
        res.status(404).send(e.message)
    }
})


app.patch("/:_id", adminAuth , async (req, res) => {
    
    let _id = req.params._id
    try {
        let existing = await Product.findOneAndUpdate({_id},{...req.body},{new: true})
        if(existing){
            res.send("Product updated successfully")  
        } else {
            res.send("Product not found")
        }
    } catch (e) {
        res.status(404).send(e.message)
    }
   
})


app.delete("/:_id", adminAuth ,  async (req, res) => {
    let _id = req.params._id
    try {
        let existing = await Product.findOneAndDelete({_id})
        if(existing){
            res.send(`User deleted successfully`)
        } else {
            res.send("user not found")
        }
    } catch (e) {
        res.status(404).send(e.message)
    }
   
})




module.exports=app