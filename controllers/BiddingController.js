import mongoose from "mongoose"
import BiddingModel from "../models/Bidding.js"

export const add = async (req, res) => {
    try {
        const currentTime = new Date();
        const formattedTime = `${currentTime
          .toLocaleDateString("ru-RU")
          .replace(/\//g, ".")} ${currentTime.toLocaleTimeString("ru-RU")}`;

        const doc = new BiddingModel({
            title: req.body.title,
            text: req.body.text,
            code: req.body.code,
            password: req.body.password,
            surveillanceСode: req.body.surveillanceСode,
            time: req.body.time
        })

        const bidding = await doc.save()

        res.json(bidding)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Не удалось создать торги"
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const biddingId = req.params.id

        if (!mongoose.Types.ObjectId.isValid(biddingId)) {
            return res.status(400).json({
                message: 'Некорректный формат ID',
            });
        }

        const bidding = await BiddingModel.findOneAndUpdate(
            { _id: biddingId },
            {new: 'true'}
        )

        if (!bidding) {
            return res.status(404).json({
                message: 'Торги не найдены',
            });
        }

        res.json(bidding);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Не удалось войти на торги"
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const biddings = await BiddingModel.find()
        
        res.json(biddings);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Не удалось войти на торги"
        })
    }
}

export const remove = async (req, res) => {
    try {
        const biddingId = req.params.id;
        
        const biddingDelete = await BiddingModel.findOneAndDelete({ _id: biddingId });
 
        if (!biddingDelete) {
            return res.status(404).json({
                message: 'Торги не найдены'
            });
        }

        res.json({
            biddingDelete,
            message: 'Статья удалена'
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Не удалось удалить открытые торги"
        })
    }
} 