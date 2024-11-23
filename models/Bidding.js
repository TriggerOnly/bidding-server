import mongoose from "mongoose";

const BiddingSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    surveillanceСode: {
      type: String,
      required: true
    },
    code: {        
      type: String,
      required: true
    },
    time: {
      type: String,
      timestamps: true
    }
  });
  

export default mongoose.model("Bidding", BiddingSchema)