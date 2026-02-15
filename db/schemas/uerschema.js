import mongoose from "mongoose"
import { maxLength } from "zod"

const {Schema}=mongoose

const userSchema=new Schema({
    name:{type: String, required: true, maxLength: 255},
    email:{type: String, required: true, maxLength: 255, unique:true},
    password:{type: String, required: true, maxLength: 255},
    role:{type: String, required: true, maxLength: 255, enum:['customer','owner']},
    phone:{type:String, maxLength:20},
    created_at:Date
})

export const User=mongoose.model('Users',userSchema)