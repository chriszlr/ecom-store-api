import express from "express"
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from "../middlewares/verifyToken.js"
import Order from "../models/Order.js"

const router = express.Router()

// create
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newOrder = new Order(req.body)

    try {
        const savedOrder = await newOrder.save()
        res.status(201).json(savedOrder)
    } catch (error) {
        console.log(error)
    }
})

// update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})

        res.status(200).json(updatedOrder)
    } catch (error) {
        console.log(error)
    }
})

// delete 
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order has been deleted.")
    } catch (error) {
        console.log(error)
    }
})

// get user order
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const order = await Order.findOne({userId: req.params.id})
        res.status(200).json(order)
    } catch (error) {
        console.log(error)
    }
})

// get all orders
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
        res.status(200).json(orders)
    } catch (error) {
        console.log(error)
    }
})

// get monthly income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();    
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (error) {
      console.log(error)
    }
  });

export default router