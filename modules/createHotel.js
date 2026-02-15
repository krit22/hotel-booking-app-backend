import { Hotel } from "../db/schemas/hotelsSchema.js"

export async function createHotel(req,res){

    //checks if owner
    // if(req.currentUser.role!="customer"){
    //     res.status(403).json({
    //     "success": false,
    //     "data": null,
    //     "error": "FORBIDDEN"
    //     })
    //     return
    // }

    const {name,description,city,country,amenities}=req.body
    try{
        const currentHotel=await Hotel.create({
            owner_id:req.currentUser._id,
            name,
            description,
            city,
            country,
            amenities,
            created_at:Date(),
            rating:0,
            total_reviews:0
        })

        res.json({
            "success": true,
            "data": {
            "id": currentHotel._id,
            "ownerId": req.currentUser._id,
            "name": name,
            "description": description,
            "city": city,
            "country": country,
            "amenities": amenities,
            "rating": 0.0,
            "totalReviews": 0
        },
  "error": null
})

    }catch(e){
        res.json({
            "success": false,
            "data": null,
            "error": "INVALID_REQUEST"
        })
    }
}