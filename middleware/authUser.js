import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.json({
                success: false,
                message: "No token provided"
            })
        }

        const token = authHeader.split(' ')[1];

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = token_decode;
        next()
    } catch (error) {
        console.error(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

export default authUser