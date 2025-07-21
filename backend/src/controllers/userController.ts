import cloudinary from "../utils/cloudinaryConfig";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

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
        return res.status(200).json({ message: "User edited successfully", user: editedUser, "url": uploadedImage.secure_url });
    } catch (error) {
        console.error("Error editing user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }

}

const now = new Date();
const date = new Date(Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
));

const logMood = async (req, res) => {
    const { mood, description } = req.body
    const userId = req.params.userId
    try {
        const loggedMood = await prisma.moodLog.upsert({
            where: {
                userId_date: { userId, date: date }
            },
            create: {
                userId,
                date: date,
                mood,
                description
            },
            update: {
                mood,
                description
            }
        })
        return res.status(200).json({ message: "Mood logged successfully", mood: loggedMood });
    } catch (error) {
        console.error("Error logging mood:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const deleteUser = async (req, res) => {
    const userId = req.params.userId
    try {
        const findUser = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }
        await prisma.habitLog.deleteMany({
            where: {
                habit: {
                    userId: userId
                }
            }
        });
        await prisma.moodLog.deleteMany({
            where: {
                userId: userId
            }
        })
        await prisma.habit.deleteMany({
            where: {
                userId: userId
            }
        })
        const deletedUser = await prisma.user.delete({
            where: {
                id: userId
            }
        });

        return res.status(200).json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export {
    editUser,
    logMood,
    deleteUser
}
