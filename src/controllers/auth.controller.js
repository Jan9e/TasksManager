import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";


export const register = async(req, res)=>{
    try{
        const {username, email, password}=req.body;

        const existing = await prisma.user.findFirst({
            where:{
                OR:[{email}, {username}],
            },
        });

        if(existing){
            return res.status(400).json({message: "User already exists"});
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data:{
                username,
                email,
                passwordHash:hashed,
            },
        });

        const { passwordHash: rt, ...safeUser } = user;

        res.json({user:safeUser});
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

export const login = async(req, res)=>{
    try{
        const {email, password}= req.body;

        const user = await prisma.user.findUnique({
            where:{email},
        });

        if(!user){
            return res.status(404).json({message:"User not found!"});
        }

        const valid = await bcrypt.compare(password, user.passwordHash);

        if(!valid){
            return res.status(401).json({message:"Invalid Password!"});
        }
        const accessToken= generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        res.json({user, accessToken, refreshToken });
    } catch(err) {
        res.status(500).json({error:err.message});
    }
};

export const refresh = async (req, res) => {
    const { refreshToken } = req.body;

    if(!refreshToken) {
        return res.status(401).json({ message: "No refresh token" });
    }

    try{
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET
        );

        const user = await prisma.user.findUnique({
            where: { id:decoded.id },
        });

        if(!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = generateAccessToken(user);

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(403).json({ message: "Token expired or invalid from catch" });
    }
};

export const logout = async (req, res) => {
    const userId = req.user.id;

    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
    });

    res.json({ message: "Logged out" });
};