import { Booking } from "../db/schemas/bookingsSchema.js"
import { Hotel } from "../db/schemas/hotelsSchema.js"
import { Room } from "../db/schemas/roomsSchema.js"

export async function getBookings(req, res) {
    let finalbookings = []

    //checks if customer
    if (req.currentUser.role != "customer") {
        res.status(403).json({
            "success": false,
            "data": null,
            "error": "FORBIDDEN"
        })
        return
    }

    let properties = { user_id: req.currentUser._id }

    const { status } = req.query
    if (status)
        properties.status = status

    try {
        let currentBookings = await Booking.find(properties)

        for (let i = 0; i < currentBookings.length; i++) {
            let booking = currentBookings[i]

            booking = booking.toObject()
            delete booking['user_id']
            delete booking['__v']

            //get room number
            const { room_number, room_type } = await Room.findById(booking.room_id)
            const { name } = await Hotel.findById(booking.hotel_id)

            booking.roomNumber = room_number
            booking.hotelName = name
            booking.roomType = room_type

            finalbookings.push(booking)
        }



        res.json({
            "success": true,
            "data": finalbookings,
            "error": null
        })
    } catch (e) {
        res.json({
            "success": false,
            "data": null,
            "error": "INVALID_REQUEST"
        })
    }
}