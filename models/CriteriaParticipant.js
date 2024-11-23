import mongoose from "mongoose"
import Criteria from "./Criteria.js"

const biddingInfoParticipantSchema = new mongoose.Schema({
    participantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant",
        require: true
    },
    biddingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bidding",
        require: true
    },
    criteriaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Criteria",
        require: true
    },
    title: {
        type: String,
        requre: true
    },
    answer: {
        type: String,
        requre: true
    }
})

export default mongoose.model("BiddingInfoparticipant", biddingInfoParticipantSchema)