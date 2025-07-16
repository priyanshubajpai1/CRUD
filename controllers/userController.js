import validator from 'validator'
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Enter all details"
            })
        }

        if(!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid email"
            })
        }

        if(password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password length should be atleast of 8 characters"
            })
        }

        const takenEmail = await userModel.findOne({email: email});
        if(takenEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            })
        }

        const genSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, genSalt)

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET, 
            {expiresIn: process.env.JWT_EXPIRES_IN}
        )

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Enter all details"
            })
        }

        if(!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid email"
            })
        }

        if(password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password length should be atleast of 8 characters"
            })
        }

        const user = await userModel.findOne({email: email})
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User not found, Give correct email or password"
            })
        }

        const isMatched = await bcrypt.compare(password, user.password)

        if(!isMatched) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password, please try again"
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET, 
            {expiresIn: process.env.JWT_EXPIRES_IN}
        )
        
        return res.status(200).json({
            success: true,
            message: "Welcome Again",
            token
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getProfile = async (req, res) => {
    try {
        const { id } = req.user;

        const user = await userModel.findById(id).select("-password");

        if(!user) {
            return res.json({
                success: false,
                message: "No such user exists"
            })
        }

        res.json({
            success: true,
            user
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {id} = req.user;
        const {name, gender, mobile} = req.body;
        if(!name || !gender || !mobile) {
            return res.json({
                success: false,
                message: "Provide all the details"
            })
        }

        const updatedUser = await userModel.findByIdAndUpdate(id, 
            {
                name: name,
                gender: gender,
                mobile: mobile
            },
            {new: true}
        )

        res.json({
            success: true,
            message: "User Profile updated successfully",
            updatedUser
        })

        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteProfile = async (req, res) => {
    try {
        const {id} = req.user;

        const deletedUser = await userModel.findByIdAndDelete(id);

        if(!deletedUser) {
            return res.json({
                success: false,
                message: "No such user exists"
            })
        }

        res.json({
            success: true,
            message: "Profile deleted successfully"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select("-password")
        res.json({
            success: true,
            users
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updatePassword = async (req, res) => {
    try {
        const {id} = req.user;
        const {password} = req.body;
        if(!password) {
            return res.json({
                success: false,
                message: "Password is required"
            })
        }

        if(password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password length should be atleast of 8 characters"
            })
        }
        
        const user = await userModel.findById(id)

        if(!user) {
            return res.json({
                success: false,
                message: "No such user exists"
            })
        }

        const genSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, genSalt)

        await userModel.findByIdAndUpdate(id, {
            password: hashedPassword
        })

        res.json({
            success: true,
            message: "Password updated successfully"
        })
    } catch (error) {
        console.error(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}