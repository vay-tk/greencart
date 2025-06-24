import User from "../models/user.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


// Register user : /api/user/register
export const register = async (req,  res)=>{
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.json({
                success:false,
                message:"All fields are required"
            })
        }
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.json({ success:false, message:"user already exist!"})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await User.create({name, email, password:hashedPassword})
        const token = await jwt.sign({id:user._id},process.env.JWT_SECRET, {expiresIn: '7d'})
        res.cookie('token',token, {
            httpOnly: true, // prevent javascript to access cookie
            secure: process.env.NODE_ENV === "production",  // use secure cookie in production
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiration time
        })
        return res.json({
            success:true,
            message:"Registration successful",
            user:{email: user.email, name: user.name}
        })
    } catch (error) {
        console.log(error.message)
        res.json({
            success:false,
            message:error.message
        })
    }
}


// Login user : /api/user/login
export const login = async (req,  res)=>{
   try {
     const { email, password } = req.body;
     if(!email || !password){
        return res.json({
            success:false,
            message:"All fields are required"
        })
     }
     const user = await User.findOne({email})
     if(!user){
        return res.json({
            success:false,
            message:"Invalid email or password"
        })
     }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            return res.json({
                success:false,
                message:"Invalid email or password"
            })
        }

        const token =  jwt.sign({id:user._id},process.env.JWT_SECRET, {expiresIn: '7d'})
        res.cookie('token',token, {
            httpOnly: true, // prevent javascript to access cookie
            secure: process.env.NODE_ENV === "production",  // use secure cookie in production
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiration time
        })
        return res.json({
            success:true,
            message:"Login successful",
            user:{email: user.email, name: user.name}
        })

   } catch (error) {
    console.log(error.message)
     res.json({
        success:false,
        message:error.message
     })
   }

}


// check Auth : /api/user/is-auth
export const isAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password")
        return res.json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error.message)
        return res.json({
            success: false,
            message: error.message
        })
    }
}


// Logout user : /api/user/logout
export const logout = async(req,  res)=>{
    try {
        res.clearCookie('token',{
            httpOnly: true, // prevent javascript to access cookie
            secure: process.env.NODE_ENV === "production",  // use secure cookie in production
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict', // CSRF protection
        })
        return res.json({
            success: true,
            message: "Logout successful"
        })
    } catch (error) {
        console.log(error.message)
        res.json({
            success: false,
            message: error.message
        })
    }
}