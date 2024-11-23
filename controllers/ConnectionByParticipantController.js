import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js"; 
import BiddingModel from "../models/Bidding.js";
import ParticipantModel from "../models/Participant.js";

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

export const connectionOrCreateParticipant = async (req, res) => {
  try {
    const { password, code, coast, surveillanceCode } = req.body;

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

    const { nameOrganization } = user;

    if (surveillanceCode) {
      const viewer = await BiddingModel.findOne({ surveillanceCode });
      if (viewer) {
        return res.json({
          message: "Зритель допущен на страницу торгов",
        });
      } else {
        return res.status(404).json({ message: "Неверный код зрителя" });
      }
    }
    const biddingId = req.params.id

    const participant = await ParticipantModel.findOne({ nameOrganization, biddingId });
    if (participant) {
      return res.json({
        message: "Участник найден",
        participant,
      });
    } else {
      const biddingId = req.params.id

      const doc = new ParticipantModel({
        nameOrganization,
        biddingId, 
        coast,
        userId,
        criteria: participant?._id, 
      });

      const newParticipant = await doc.save();

      return res.status(201).json({
        message: "Новый участник успешно создан",
        newParticipant,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Произошла ошибка при обработке запроса",
    });
  }
};

export const getAllParticipants = async (req, res) => {
  try {
    const biddingId = req.params.id
    
    const users = await ParticipantModel.find({biddingId}).lean();

    if (!users || users.length === 0) {
      return res.json({
        message: "Нет подключенных организаций"
      });
    }
    res.json({
      users
    }) 
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Произошла ошибка при обработке получении всех организаций",
    });
  }
}