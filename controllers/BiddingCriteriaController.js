import BiddingInfoModel from '../models/Criteria.js'

export const add = async (req, res) => {
    try {
        const {title} = req.body
        const biddingId = req.params.id
        
        const existingDevInf = await BiddingInfoModel.findOne({biddingId, title})

        if(existingDevInf) {
            return res.status(400).json({
                message: 'Подобный параметр уже существует'
            })
        }

        if(!title) {
            return res.json({})
        }

        const doc = new BiddingInfoModel({
            title,
            biddingId
        });

        const biddingInfo = await doc.save()

        res.json(
            biddingInfo
        )
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось добавить информацию о девайсе'
        })
    }
}

export const getAllInfo = async (req, res) => {
    try {
        const biddingId = req.params.id;
        
        const allInfoBidding = await BiddingInfoModel.find({ biddingId });

        if (allInfoBidding.length === 0) {
            return res.json({
                message: 'Информация не найдена'
            });
        }

        return res.json(allInfoBidding)
    } catch (err) { 
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось загрузить информацию о торгах'
        });
    }
} 