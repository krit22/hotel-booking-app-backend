import express from "express"
import dotenv from "dotenv"
import { authRouter } from "./routes/auth.js"
import mongoose from "mongoose"
import { authMiddleware } from "./modules/authMiddleware.js"
import { createHotel } from "./modules/createHotel.js"
import { addRoom } from "./modules/addRoom.js"
import { searchHotel } from "./modules/searchHotel.js"
import { bookHotel } from "./modules/book-hotel.js"


dotenv.config()
const app=express()
app.use(express.json())


//non authenticated endpoints
app.use("/api/auth",authRouter)

//auth middleware
app.use(authMiddleware)


//authenticated endpoints
app.post("/api/hotels",createHotel)
app.post("/api/hotels/:hotelId/rooms",addRoom)
app.get("/api/hotels",searchHotel)
app.post("/api/booking",bookHotel)


//start server
app.listen(3000,start)
async function start(){
    try{
        await mongoose.connect("mongodb+srv://kritkumar2:krit123456789@krit.s7ppupj.mongodb.net/hotelsdb")
        console.log("Conencted to database successfully...")
        console.log(`Running the server on the port ${process.env.port}`)
    }catch(e){
        console.log(`an error occured: ${e}`)
    }
}
