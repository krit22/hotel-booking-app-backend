import { Hotel } from "../db/schemas/hotelsSchema.js";
import { Room } from "../db/schemas/roomsSchema.js";

export async function addRoom(req, res) {
    //checks if owner
    if (req.currentUser.role != "owner") {
        res.status(403).json({
            "success": false,
            "data": null,
            "error": "FORBIDDEN"
        })
        return
    }


    const { roomNumber, roomType, pricePerNight, maxOccupancy } = req.body;
    const hotelId = req.params.hotelId

    console.log(req.currentUser._id)

    let currentHotel
    try {
        currentHotel = await Hotel.findById(hotelId)
        cosnole.log(currentHotel)
    } catch (e) {
        //no such hotel
        if (!currentHotel) {
            res.status(404).json({
                "success": false,
                "data": null,
                "error": "HOTEL_NOT_FOUND"
            })
            return
        }
    }




    //not owner
    if (currentHotel.owner_id != req.currentUser._id) {
        res.status(403).json({
            "success": false,
            "data": null,
            "error": "FORBIDDEN"
        })
        return
    }

    try {
        const currentRoom = await Room.create(
            {
                hotel_id: hotelId,
                room_number: roomNumber,
                room_type: roomType,
                price_per_night: pricePerNight,
                max_occupance: maxOccupancy,
                created_at: Date()
            }
        )

        res.json({
            "success": true,
            "data": {
                "id": currentRoom._id,
                "hotelId": hotelId,
                "roomNumber": roomNumber,
                "roomType": roomType,
                "pricePerNight": pricePerNight,
                "maxOccupancy": maxOccupancy,
            },
            "error": null
        })
    } catch (e) {
        if (e.code == 11000) {
            res.status(400).json({
                "success": false,
                "data": null,
                "error": "ROOM_ALREADY_EXISTS"
            })
        } else {
            res.status(400).json({
                "success": false,
                "data": null,
                "error": "INVALID_REQUEST"
            })
        }
    }
}