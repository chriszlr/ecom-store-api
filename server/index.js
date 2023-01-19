import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
mongoose.set('strictQuery', true)
import userRoutes from "./routes/user-routes.js"
import authRoutes from "./routes/auth-routes.js"
import productRoutes from "./routes/product-routes.js"
import cartRoutes from "./routes/cart-routes.js"

const app = express()
app.use(express.json())


app.use("/api/auth/", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)

app.listen(process.env.PORT, () => console.log(`server listening on port ${process.env.PORT}`))
mongoose.connect(process.env.MONGO_URI)
.then(console.log("Connected to MongoDB"))
.catch(err => console.log(err))