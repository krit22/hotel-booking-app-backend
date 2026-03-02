import { Hotel } from "../db/schemas/hotelsSchema.js";
import { Room } from "../db/schemas/roomsSchema.js";

export async function searchHotel(req,res){

    let {city,country,minPrice,maxPrice,minRating}=req.query;
    if(!minPrice)
        minPrice=0

    if(!maxPrice)
        maxPrice=Number.MAX_SAFE_INTEGER

    let filter={};

    if(country)
        filter.country=country

    if(city)
        filter.city=city

    if(minRating)
        filter.rating={$gt:minRating}

    const currentHotels=await Hotel.find(filter)
    let finalHotels=[]

    
    for(let i=0;i<currentHotels.length;i++){

        let hotel=currentHotels[i]
        
        const currentRoom=await Room.find({
            hotel_id:hotel._id.toString()
        })


        if(currentRoom){
            let currentMin=currentRoom[0].price_per_night
            let currentMax=0

            currentRoom.map(room=>{
                if(room.price_per_night>currentMax)
                    currentMax=room.price_per_night

                if(room.price_per_night<currentMin)
                    currentMin=room.price_per_night
            })



            if(currentMin<=maxPrice && currentMax>=minPrice){

                const obj=hotel.toObject()
                delete obj.owner_id
                delete obj.created_at
                delete obj.__v
                obj.minPricePerNight=minPrice
                finalHotels.push(obj)
            }
        }
    }

    res.json({
        success:"true",
        data:finalHotels,
        error:null
    })

}