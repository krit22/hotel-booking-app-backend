import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    user_id: String,
    hotel_id: String,
    booking_id: String,
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: String,
    created_at: { type: Date, default: new Date() },
})

reviewSchema.index({ booking_id: 1, user_id: 1 }, { unique: true })

export const Review = mongoose.model("Reviews", reviewSchema)