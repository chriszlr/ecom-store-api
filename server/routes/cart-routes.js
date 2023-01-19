import express from "express"
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from "../middlewares/verifyToken.js"
import Cart from "../models/Cart.js"

const router = express.Router()

// create
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newCart = new Cart(req.body)

    try {
        const savedCart = await newCart.save()
        res.status(201).json(savedCart)
    } catch (error) {
        console.log(error)
    }
})

// update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})

        res.status(200).json(updatedCart)
    } catch (error) {
        console.log(error)
    }
})

// delete 
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted.")
    } catch (error) {
        console.log(error)
    }
})

// get user cart
router.get("/:id", async (req, res) => {
    try {
        const cart = await Cart.findOne({userId: req.params.id})
        res.status(200).json(cart)
    } catch (error) {
        console.log(error)
    }
})

// get all cart
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find()
        res.status(200).json(carts)
    } catch (error) {
        console.log(error)
    }
})

export default router