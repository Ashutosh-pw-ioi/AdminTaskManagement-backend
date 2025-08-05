import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret123";

const handleLogin = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Email, password, and role are required." });
        }

        let user: any;
        const roleUpperCase = role.toUpperCase();
        if (roleUpperCase === "ADMIN") {
            user = await prisma.admin.findUnique({
                where: { email }
            });
        } else if (roleUpperCase === "OPERATION") {
            user = await prisma.operationTeamMember.findUnique({
                where: { email }
            });
        } else {
            return res.status(400).json({ message: "Invalid role." });
        }
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password." });
        }
        const reply = {
            email: user.email,
            userId: user.id,
            role: role,
            name: user.name || "No Name Provided"
        }

        const token = jwt.sign(
            { emailId: email, role: role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            user: reply,
            message: "Login successful"
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

const handleLogout = async (req: Request, res: Response) => {
    try {
        const { token } = req.cookies;
         if (!token) return res.status(200).send("Already logged out");
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
 }
const checkUserAuthentication = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized: user not found in request" });
        }

        const { id, name, email, role } = user;

        const reply = {
            id,
            name,
            email,
            role,
            message: "User is authenticated",
        };

        res.status(200).json(reply);
    } catch (error) {
        console.error("Authentication check failed:", error);
        res.status(500).json({ error: "Failed to verify authentication" });
    }
};
export { handleLogin, handleLogout, checkUserAuthentication };
