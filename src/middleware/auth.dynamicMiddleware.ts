import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authAdmin, authOperation } from "./auth.middleware.js";

interface JwtPayload {
  emailId: string;
  role: "ADMIN" | "OPERATION";
}

export const authDynamic = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultsecret123"
    ) as JwtPayload;
    if (decoded.role === "ADMIN") {
      return authAdmin(req, res, next);
    } else if (decoded.role === "OPERATION") {
      return authOperation(req, res, next);
    } else {
      return res.status(403).json({ message: "Access denied. Invalid role." });
    }
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid token." });
  }
};
