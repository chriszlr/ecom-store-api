import express from "express"
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from "../middlewares/verifyToken.js"
import Product from "../models/Product.js"

const router = express.Router()

// create
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body)

    try {
        const savedProduct = await newProduct.save()
        res.status(201).json(savedProduct)
    } catch (error) {
        console.log(error)
    }
})

// update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})

        res.status(200).json(updatedProduct)
    } catch (error) {
        console.log(error)
    }
})

// delete 
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted.")
    } catch (error) {
        console.log(error)
    }
})

// get product
router.get("/:id", async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.status(200).json(product)
})

// get all products
router.get("/", async (req, res) => {
    const qNew = req.query.new
    const qCategory = req.query.category

    try {
        let products;

        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(5)
        }else if(qCategory){
            products = await Product.find({categories: {
                $in: [qCategory],
            }})
        }else{
            products = await Product.find()
        }
        res.status(200).json(products)
    } catch (error) {
        console.log(error)
    }
})

export default router