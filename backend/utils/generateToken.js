import Jwt from 'jsonwebtoken'
 
const generateToken=(res,userId)=>{
    
    const token = Jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn:"30d"
    })
   
    if (token) {
        res.cookie('Jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'production', // Ensure cookies are secure only in production
            sameSite: process.env.NODE_ENV !== 'production' ? 'None' : 'Strict', // Ensure SameSite=None in production
            path: '/', // Set path to root
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });
    }
    
}

export default generateToken