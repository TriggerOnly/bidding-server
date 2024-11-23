import mongoose from "mongoose"

const biddingInfoSchema = new mongoose.Schema({
    biddingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bidding",
        require: true
    },
    title: {
        type: String,
        requre: true
    }
})

export default mongoose.model("BiddingInfo", biddingInfoSchema)