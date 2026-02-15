import jwt from 'jsonwebtoken'
import { User } from '../db/schemas/uerschema.js'


//checks if header has a valid token
//decodes the token to find currentUser
//adds currentUser to req
export async function authMiddleware(req,res,next){
    const token=req.header("token")

    //no token in header
    if(!token){
        res.status(401).json({
        "success": false,
        "data": null,
        "error": "UNAUTHORIZED"
    })
    return
    }

    try{//corrrect token
        const {id}=jwt.verify(token,process.env.JWT_SECRET)
        
        const currentUser=await User.findById(id)
        req.currentUser=currentUser

        console.log("authenticated a request...")

    }catch(e){//wrong token
        res.status(401).json({
            "success": false,
            "data": null,
            "error": "UNAUTHORIZED"
        })
    }
    

    next()
}