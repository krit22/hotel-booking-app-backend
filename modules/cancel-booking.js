import { Booking } from "../db/schemas/bookingsSchema.js"

export async function cancelBooking(req, res) {
    //checks if customer
    if (req.currentUser.role != "customer") {
        res.status(403).json({
            "success": false,
            "data": null,
            "error": "UNAUTHORIZED"
        })
        return
    }

    const { bookingId } = req.params

    try {

        const currentBooking = await Booking.findById(bookingId)

        //booking not found
        if (!currentBooking) {
            res.status(404).json({
                "success": false,
                "data": null,
                "error": "BOOKING_NOT_FOUND"
            })
            return
        }

        //not your booking
        if (req.currentUser._id != currentBooking.user_id) {
            res.status(403).json({
                "success": false,
                "data": null,
                "error": "FORBIDDEN"
            })
            return
        }

        //already cancelled
        if (currentBooking.status == "cancelled") {
            res.json({
                "success": false,
                "data": null,
                "error": "ALREADY_CANCELLED"
            })
            return
        }

        //cancellation deadline passed
        console.log("number of hours until checkin:" + (currentBooking.check_in_date - new Date()))
        if ((currentBooking.check_in_date - new Date()) / (1000 * 60 * 60) < 24) {
            res.json({
                "success": false,
                "data": null,
                "error": "CANCELLATION_DEADLINE_PASSED"
            })
            return
        }

        //cancellation
        await Booking.findOneAndUpdate({ _id: bookingId }, { status: "cancelled" })
        res.json({
            "success": true,
            "data": {
                "id": bookingId,
                "status": "cancelled",
                "cancelledAt": new Date()
            },
            "error": null
        })

    } catch (e) {
        res.json(res.json({
            "success": false,
            "data": null,
            "error": "BOOKING_NOT_FOUND"
        }))
    }
}