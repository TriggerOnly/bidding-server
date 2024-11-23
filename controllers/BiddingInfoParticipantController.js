import BiddingInfoParticipantModel from '../models/CriteriaParticipant.js';
import UserModel from '../models/User.js'; 
import Criteria from '../models/Criteria.js'; 
import jwt from 'jsonwebtoken'; 

const getUserIdFromToken = (req) => {
    if (!req.headers.authorization) {
        throw new Error("Токен не предоставлен");
    }

    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        throw new Error("Некорректный формат токена");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded._id;
};

export const add = async (req, res) => {
    try {
      const answers = req.body.answers; 
  
      if (!Array.isArray(answers)) {
        return res.status(400).json({ message: 'Ожидается массив ответов' });
      }
  
      const biddingId = req.params.id;
  
      let userId;
      try {     
        userId = getUserIdFromToken(req);  
      } catch (error) {
        return res.status(401).json({ message: "Токен недействителен или отсутствует" });
      }
  
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }
  
      const results = [];
      for (const { title, answer } of answers) {
        const existingDevInf = await BiddingInfoParticipantModel.findOne({ biddingId, title, answer });
        if (existingDevInf) {
          results.push({ title, message: 'Подобный параметр уже заполнен' }); 
        }
  
        const criteria = await Criteria.findOne({ title });
        if (!criteria) {
          results.push({ title, message: "Критерий с таким названием не найден" });;
        }
  
        const doc = new BiddingInfoParticipantModel({
          participantId: user._id,  
          biddingId,  
          criteriaId: criteria._id,  
          title,
          answer
        });
  
        const biddingInfo = await doc.save();
        results.push({ title, message: 'Ответ успешно добавлен', data: biddingInfo });
      }
  
      res.json(results);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось добавить информацию о торгах'
      });
    }
}
    
export const getAll = async (req, res) => {
    try {        
        const biddingId = req.params.id

        const allInfo = await BiddingInfoParticipantModel.find({biddingId})

        res.json(allInfo)
        } catch (error) {
            console.log(error);
            res.status(500).json({
            message: 'Не удалось загрузить информацию о торгах'
      });
    }
}