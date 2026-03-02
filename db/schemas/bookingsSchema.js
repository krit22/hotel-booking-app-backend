import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema({
    user_id: String,
    room_id: String,
    hotel_id: String,
    check_in_date: { type: Date, required: true },
    check_out_date: { type: Date, required: true },
    guests: { type: Number, required: true },
    total_price: { type: Number, require: true },
    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
    booking_date: { type: Date, default: Date.now },
    cancelled_at: { type: Date },
});

export const Booking = mongoose.model("Bookings", bookingSchema)
