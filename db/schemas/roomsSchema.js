import mongoose from "mongoose"
import { maxLength } from "zod"
const {Schema}=mongoose

const roomSchema=new Schema({
    hotel_id:String,
    room_number:{type:String,maxLength:30,unique:true,required:true},
    room_type:{type:String,maxLength:100,required:true},
    price_per_night:{type:Number,require:true,required:true},
    max_occupance:{type:Number,require:true,integer:true,required:true},
    created_at:Date
})

roomSchema.index({hotel_id:1,room_number:1},{unique:true})

export const Room = mongoose.model("Rooms",roomSchema)

//cascading logic for rooms
