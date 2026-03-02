import { Booking } from "../db/schemas/bookingsSchema.js";
import { Review } from "../db/schemas/reviewSchema.js";

export async function reviewBooking(req, res) {

    let { bookingId, rating, comment } = req.body;

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
        if (currentBooking.user_id != req.currentUser._id) {
            res.json({
                "success": false,
                "data": null,
                "error": "FORBIDDEN"
            })
            return
        }

        //booking not eligible
        if (new Date() < currentBooking.check_out_date || currentBooking.status == "cancelled") {
            res.json({
                "success": false,
                "data": null,
                "error": "BOOKING_NOT_ELIGIBLE"
            })
            return
        }

        console.log("dsk")
        const currentReview = await Review.create({
            user_id: currentBooking.user_id,
            hotel_id: currentBooking.hotel_id,
            booking_id: currentBooking._id,
            rating: rating,
            comment: comment,
            created_at: new Date(),
        })
        console.log("Done...")
        res.status(201).json({
            "success": true,
            "data": {
                "id": currentReview._id,
                "userId": currentBooking.user_id,
                "hotelId": req.currentUser.userId,
                "bookingId": currentBooking._id,
                "rating": rating,
                "comment": comment,
                "createdAt": new Date()
            },
            "error": null
        })

    } catch (e) {
        //already reviewed (duplicate key error)
        if (e.code == 11000) {
            res.status(400).json({
                "success": false,
                "data": null,
                "error": "ALREADY_REVIEWED"
            })
            return
        }
        //invalid schema error
        res.status(400).json({
            "success": false,
            "data": null,
            "error": "INVALID_REQUEST"
        })
        console.log(e)
    }
}