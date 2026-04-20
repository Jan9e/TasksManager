import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

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

        const token = generateToken(user);
        res.json({user, token});
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
        const token= generateToken(user);
        res.json({user, token});
    } catch(err) {
        res.status(500).json({error:err.message});
    }
};