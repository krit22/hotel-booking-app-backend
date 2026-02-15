import express from "express"
import bcrypt from "bcryptjs"
import { User } from "../db/schemas/uerschema.js"
import {z} from "zod"
import jwt from "jsonwebtoken"



export const authRouter=express.Router()


authRouter.post("/signup",signupHandler)
authRouter.post("/login",loginHandler)

async function signupHandler(req,res){
    let {name,email,password,role,phone}=req.body;

    


    const currentdate=new Date()
    
    if(role==undefined) role="customer"
    const hashedPassword=await bcrypt.hash(password,3);

    try{
        const document=await User.create({
            name,
            email,
            password:hashedPassword,
            role,
            phone,
            created_at:currentdate
        })

        res.status(201).json({
            "success": true,
            "data":{
                "id":document._id,
                "name":document.name,
                "email":document.email,
                "role":document.role,
                "phone":document.phone
            },
            "error":"null"
        })

    }catch(e){
        if(e.code==11000){
            res.status(400).json({
            "success": false,
            "data": null,
            "error": "EMAIL_ALREADY_EXISTS"
        })
        }else{
            res.status(400).json({
            "success": false,
            "data": null,
            "error": "INVALID_REQUEST"
            })
        }
        
        
    }
}

async function loginHandler(req,res){
    const {email,password}=req.body;

    //incorrect schema
    if(!email || !password){
       res.json({
            "success": false,
            "data": null,
            "error": "INVALID_REQUEST"
        })
        return  
    }
        
    //find db
    const currentUser=await User.findOne({
        email
    })
    
    //user does not exist
    if(!currentUser){
        res.json({
        "success": false,
        "data": null,
        "error": "INVALID_CREDENTIALS"
        })
        return
    }

    //password checking
    if(!await bcrypt.compare(password,currentUser.password)){
        res.json({
        "success": false,
        "data": null,
        "error": "INVALID_CREDENTIALS"
        })
        return
    }


    //correct password
    const token=jwt.sign({
        id:currentUser._id
    },process.env.JWT_SECRET)

    res.json({
        "success":"true",
        "data":{
            "token":token,
            "user":{
                "id":currentUser._id,
                "name:":currentUser.name,
                "email":currentUser.email,
                "role":currentUser.role
            }
        },
        "error":null
    })
    
    
}