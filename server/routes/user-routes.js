import express from "express"
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from "../middlewares/verifyToken.js"
import User from "../models/User.js"

const router = express.Router()

// update user
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if(req.user.id === req.params.id || req.user.isAdmin){
        if(req.body.password){
            req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {new: true})
            res.status(200).json(updatedUser)
        } catch (error) {
            console.log(error)
        }
    }
})

// delete user
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("Account has been deleted.")
    } catch (error) {
        console.log(error)
    }
})

// get user
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc
        
        res.status(200).json(others)
    } catch (error) {
        console.log(error)
    }
})

// get all user
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new

    try {
        const users = query ? await User.find().sort({_id: -1}).limit(5) : await User.find()
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
    }
})

// get user stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastyear = new Date(date.setFullYear(date.getFullYear() - 1))

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastyear } } },
            {
                $project: {
                    month: {$month: "$createdAt"},
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1}
                }
            }
        ])

        res.status(200).json(data)
    } catch (error) {
        console.log(error)
    }
})

export default router