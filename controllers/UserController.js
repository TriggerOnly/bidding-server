import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import UserModel from "../models/User.js"

export const register = async (req, res) => {
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10) 
        const hash = await bcrypt.hash(password, salt) 

        const doc = new UserModel({
            email: req.body.email,
            nameOrganization: req.body.nameOrganization,
            passwordHash: hash
        })

        const user = await doc.save()
        const token = jwt.sign(
            {_id: user._id},
            "key123",
            {expiresIn: "7d"}
        ) 

        res.json({
            user,
            token
        })
    } catch (error) { 
        console.log(error)
        res.status(500).json({
            message: "Не удалось зарегистрироваться"
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})

        if(!user) {
            return res.status(404).json({
                message: "Пользователь не найден"
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Не удалось войти',
            })  
        }

        const token = jwt.sign(
            {_id: user._id},  
            'key123', 
            {expiresIn: '7d'}
        ) 

        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token   
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Не удалось войти"
        })
    }
}

export const auth = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if(!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
        const {passwordHash, ...userData} = user._doc
        
        res.json(userData)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Не удалось авторизоваться"
        })
    }
}