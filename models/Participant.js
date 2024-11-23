import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
    nameOrganization: {
        type: String,
        required: true
    },
    biddingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bidding",
        require: true
    },
    criteria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BiddingInfo",
        require: true
    },
    coast: {
        type: Number,
        required: true
    }
})

export default mongoose.model("Participant", ParticipantSchema)