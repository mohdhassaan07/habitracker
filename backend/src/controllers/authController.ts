import { PrismaClient } from "@prisma/client";
import cloudinary from "../utils/cloudinaryConfig";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

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
                const token = jwt.sign({ id: registered_user.id }, process.env.JWT_SECRET);
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
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
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

const editUser = async (req, res) => {
    const { name, file } = req.body;
    const userId = req.params.id;

    try {
        const uploadedImage = await cloudinary.uploader
            .upload(file,
                function (error, result) {
                    if (error) {
                        return res.status(500).json({ message: "Error uploading image" })
                    }
                    console.log(result.secure_url)
                }
            ).catch((err) => {
                console.error("Unhandled promise rejection:", err);
                res.status(500).json({ message: "Unhandled promise rejection" });
            }
            )

        if (!uploadedImage || !uploadedImage.secure_url) {
            return res.status(500).json({ message: "Error uploading image" });
        }
        console.log(uploadedImage.secure_url);

        const editedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                name: name,
                profilePic: uploadedImage.secure_url
            }
        });
        return res.status(200).json({ message: "User edited successfully", user: editedUser, "url":uploadedImage.secure_url });
    } catch (error) {
        console.error("Error editing user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }

}

export {
    createUser,
    signin,
    SignOut,
    editUser
}