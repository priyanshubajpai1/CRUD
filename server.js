import express from 'express'
import 'dotenv/config'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'

const app = express()
const PORT = 3000
connectDB()

app.use(express.json())
app.use('/api/v1', userRouter)


app.get('/', (req, res) => {
    res.send(`Server is running`)
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})