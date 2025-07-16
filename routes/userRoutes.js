import express from 'express'
import { deleteProfile, getAllUsers, getProfile, loginUser, registerUser, updatePassword, updateProfile } from '../controllers/userController.js'
import authUser from '../middleware/authUser.js'


const userRouter = express.Router()

userRouter.post('/registerUser', registerUser)
userRouter.post('/loginUser', loginUser)
userRouter.get('/getProfile', authUser , getProfile)
userRouter.put('/updateProfile', authUser , updateProfile)
userRouter.delete('/deleteProfile', authUser , deleteProfile)
userRouter.get('/getAllUsers', authUser , getAllUsers)
userRouter.post('/updatePassword', authUser , updatePassword)

export default userRouter