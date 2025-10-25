import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { oauth2client } from "../utils/googleConfig"
import axios from 'axios'
const prisma = new PrismaClient()

const googleLogin = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ error: "Code is required" })
        }

        const googleRes = await oauth2client.getToken(code)
        oauth2client.setCredentials(googleRes.tokens)
        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,)
        const { email, name, picture } = userRes.data;

        let user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    profilePic: picture,
                    password: bcrypt.hashSync(email, 10) // Using email as a pseudo-password
                }
            })
        }
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000,
        })

        const { password, ...userData } = user; // Exclude password from the response
        console.log("Google user data:", userRes.data);
        return res.status(200).json({ message: "User logged in successfully", user: userData, token: token });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, Email and password are required" });
    }
    const findUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (findUser) {
        return res.status(400).json({ error: "User already exists" });
    }
    try {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                const registered_user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password: hash,
                    },
                });
                const token = jwt.sign({ id: registered_user.id }, process.env.JWT_SECRET)
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 2 * 24 * 60 * 60 * 1000,
                });
                // Exclude password from the response
                const { password, ...user } = registered_user
                console.log("User created:", user);
                console.log("Token generated:", token);

                return res.status(201).json({ message: 'user signup successfull', user: user });
            })
        })
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const signin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" })
    }
    try {
        const findUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!findUser) {
            return res.status(400).json({ error: "User not found" });
        }
        bcrypt.compare(password, findUser.password, function (err, result) {
            if (result) {
                const jwt_token = jwt.sign({ id: findUser.id }, process.env.JWT_SECRET);
                res.cookie("token", jwt_token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 2 * 24 * 60 * 60 * 1000,
                })
                console.log("User logged in:", findUser);
                const { password, ...user } = findUser

                return res.status(200).json({ message: "user logined", user: user, token: jwt_token });
            }
            else return res.status(404).json({ message: "something went wrong" })
        })

    } catch (error) {
        console.error("Error signing in:", error);
        res.status(500).json({ error: "Internal server error" });

    }
}

const SignOut = ((req, res) => {
    res.clearCookie("token");
    console.log("User logged out");
    return res.status(200).json({ message: "User logged out successfully" });
})


export {
    createUser,
    signin,
    SignOut,
    googleLogin
}