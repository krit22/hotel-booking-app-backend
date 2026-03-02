import { Booking } from "../db/schemas/bookingsSchema.js";
import { Room } from "../db/schemas/roomsSchema.js";

export async function bookHotel(req, res) {

    //checks if customer
    if (req.currentUser.role != "customer") {
        res.status(403).json({
            "success": false,
            "data": null,
            "error": "FORBIDDEN"
        })
        return
    }

    let { roomId, checkInDate, checkOutDate, guests } = req.body;

    // if (!guests || !checkOutDate || !roomId || !checkInDate) {
    //     res.json({
    //         "success": false,
    //         "data": null,
    //         "error": "INVALID_REQUEST"
    //     })
    //     return
    // }

    checkInDate = new Date(checkInDate)
    checkOutDate = new Date(checkOutDate)

    //finds room
    const currentRoom = await Room.findById(roomId)

    if (!currentRoom) {
        res.status(404).json({
            "success": false,
            "data": null,
            "error": "ROOM_NOT_FOUND"
        })
        return
    }

    //check overlapping dates
    const currentBookings = await Booking.find({
        room_id: roomId
    })
    //fetch all bookings
    //compare against each booking
    if (currentBookings) {
        for (let i = 0; i < currentBookings.length; i++) {
            let booking = currentBookings[i]

            let a_start = booking.check_in_date
            let a_end = booking.check_out_date
            let b_start = checkInDate
            let b_end = checkOutDate

            if (dateRangeOverlaps(a_start, a_end, b_start, b_end)) {
                console.log("overlapping dataes")
                res.status(400).json({
                    "success": false,
                    "data": null,
                    "error": "ROOM_NOT_AVAILABLE"
                })
                return
            }
        }
    }

    //issues with the date
    if (checkInDate < new Date() || checkInDate > checkOutDate) {
        res.status(400).json({
            "success": false,
            "data": null,
            "error": "INVALID_DATES"
        })
        return
    }

    //invalid guests count
    if (currentRoom.max_occupance < guests) {
        res.json({
            "success": false,
            "data": null,
            "error": "INVALID_CAPACITY"
        })
        return
    }



    const nights = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
    const { hotel_id, price_per_night } = currentRoom


    try {

        const currentBooking = await Booking.create({
            user_id: req.currentUser._id,
            room_id: roomId,
            hotel_id: hotel_id,
            check_in_date: checkInDate,
            check_out_date: checkOutDate,
            guests: guests,
            total_price: nights * price_per_night,
            status: "confirmed",
            booking_date: Date.now()
        });


        res.status(201).json({
            "success": true,
            "data": {
                "id": currentBooking._id,
                "userId": req.currentUser._id,
                "roomId": roomId,
                "hotelId": hotel_id,
                "checkInDate": checkInDate,
                "checkOutDate": checkOutDate,
                "guests": guests,
                "totalPrice": nights * price_per_night,
                "status": "confirmed",
                "bookingDate": Date.now
            },
            "error": null
        })

    } catch (e) {
        res.status(400).json({
            "success": false,
            "data": null,
            "error": "INVALID_REQUEST"
        })
    }
}

//returns true if a and b overlap
function dateRangeOverlaps(a_start, a_end, b_start, b_end) {
    if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
    if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
    if (b_start < a_start && a_end < b_end) return true; // a in b
    if (a_start < b_start && b_end < a_end) return true; // b in a 
    return false;
}