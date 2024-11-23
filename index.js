import mongoose from "mongoose"
import express from "express"
import cors from "cors"
import * as UserController from "./controllers/UserController.js"
import * as BiddingController from './controllers/BiddingController.js'
import * as BiddingCriteriaController from './controllers/BiddingCriteriaController.js'
import * as ConnectionByParticipantController from './controllers/ConnectionByParticipantController.js'
import * as BiddingInfoParticipantController from "./controllers/BiddingInfoParticipantController.js"
import checkAuth from "./utils/checkAuth.js"
import dotenv from "dotenv"

mongoose
    .connect('mongodb+srv://Trigger:Trigger1911@bidding.nd19p.mongodb.net/?retryWrites=true&w=majority&appName=bidding')
    .then(() => console.log('Connected'))
    .catch((error) => console.log('MongoDB error', error))

const app = express()

dotenv.config(); 
app.use(express.json())
app.use(cors({
    origin: "*" 
})) 
  
app.post("/register", UserController.register)
app.post("/login", UserController.login)
app.get("/auth", checkAuth, UserController.auth)

app.post("/createBidding", checkAuth, BiddingController.add)    
app.get("/biddings/:id", checkAuth, BiddingController.getOne)
app.get("/biddings", BiddingController.getAll)
app.delete("/biddings/:id", checkAuth, BiddingController.remove)

app.post("/createBiddingCriteria/:id", checkAuth, BiddingCriteriaController.add)
app.get("/allBiddingCriteria/:id", checkAuth, BiddingCriteriaController.getAllInfo) 

app.post("/connectionByParticipant/:id", checkAuth, ConnectionByParticipantController.connectionOrCreateParticipant)
app.get("/biddings/participants/:id", checkAuth, ConnectionByParticipantController.getAllParticipants)

app.post("/createBiddingCriteriaParticipant/:id", checkAuth, BiddingInfoParticipantController.add)
app.get("/BiddingCriteriaParticipant/:id", checkAuth, BiddingInfoParticipantController.getAll)

app.listen(4000, (error) => {
    if (error) { 
        console.log(error) 
    }  
})  