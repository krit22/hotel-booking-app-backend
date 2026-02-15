import mongoose from "mongoose"
import { maxLength, number } from "zod"
import { required } from "zod/mini"
const {Schema}=mongoose

const hotelSchema=new Schema({
    owner_id:String,
    name:{type:String,maxLength:225,required:true},
    description:{type:String},
    city:{type:String, required:true, maxLength:100},
    country:{type:String, required:true, maxLength:100},
    amenities:[{type:String}],
    rating:{type:Number,min:0,max:5,required:true},
    total_reviews:{type:Number,integer:true,default:0,required:true},
    created_at:Date 
})

export const Hotel=mongoose.model('Hoteks',hotelSchema)