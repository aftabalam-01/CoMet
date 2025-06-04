import prisma from "../db/db_connection";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { hashedPassword, comparePassword } from "../utils/hashPassword";
import { generateToken } from "../utils/jwtToken";
import { generateRefreshToken } from "../utils/refreshToken";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";
import { sentResetEmail } from "./mail";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, phone, image, role, email, password } = req.body;

  const findUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (findUser) {
    res.status(409).json("User Already Exists");
  } else {
    const hashPassword = await hashedPassword(password);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        image,
        phone,
        password: hashPassword,
        role,
      },
    });
    res.status(200).json({
      newUser,
    });
  }
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    res.status(404);
    throw new Error("User not Found");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid Email or Password");
  }

  const refreshToken = generateRefreshToken({ id: user.id });

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 72 * 60 * 60 * 1000,
  });

  const { password: _, ...safeUser } = updatedUser;

  res.status(200).json({
    message: "Login successful",
    user: safeUser,
  });
});

export const handleRefreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const cookie = req.cookies;

    if (!cookie?.refreshToken) {
      res.status(401);
      throw new Error("No Refresh Token in the Cookie ");
    }
    const refreshToken = cookie.refreshToken;
    const user = await prisma.user.findFirst({
      where: {
        refreshToken,
      },
    });
    if (!user) {
      res.status(404);
      throw new Error("No User Found in System");
    }
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as jwt.JwtPayload;

      if (typeof decoded !== "object" || !("id" in decoded)) {
        res.status(403);
        throw new Error("Invalid Token Payload");
      }

      if (user.id !== decoded.id) {
        res.status(403);
        throw new Error("Refresh Token does not match User");
      }

      const accessToken = generateToken(user.id);
      res.json({ accessToken });
    } catch (error: any) {
      res.status(403);
      throw new Error(error);
    }
  }
);

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const isAdmin = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (isAdmin?.role !== "ADMIN") {
    res.status(403);
    throw new Error("Not Authorrised");
  }

  if (!isAdmin || !isAdmin.password) {
    res.status(403);
    throw new Error("Email or Password Missing");
  }
  const isMatch = await comparePassword(password, isAdmin.password);
  if (!isMatch) {
    res.status(403);
    throw new Error("Invalid Email or Password");
  }
  const refreshToken = generateRefreshToken({ id: isAdmin.id });
  const updatedUser = await prisma.user.update({
    where: { id: isAdmin.id },
    data: {
      refreshToken,
    },
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 72 * 60 * 60 * 1000,
  });
  const { password: _, ...safeUser } = updatedUser;
  res.status(200).json({
    message: "Login successful",
    admin: safeUser,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) {
    res.status(404).json({ message: "No Refresh Token in cookies" });
    return;
  }
  const refreshToken = cookie.refreshToken;
  const user = await prisma.user.findFirst({
    where: {
      refreshToken,
    },
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  if (!user) {
    res.sendStatus(204);
    return;
  }
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: " ",
    },
  });
  res.status(200).json({ message: "Logged Out Successfully" });
});

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
    }

    try {
      const token = await user?.passwordResetToken;
      prisma.user.upsert;
      const resetURL = `Hi, Please follow this link to reset your password. This link will be only valid for 10 Minutes from now <a href='http://localhost:4000/api/user/reset-password/${token}'>Click Here</a>`;
      const data = {
        to: email,
        text: "Hello from CoMet",
        subject: "Password Reset Link",
        html: resetURL,
      };
      sentResetEmail;
      res.status(200).json({ Token: token });
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = parseInt(id, 10);
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    res.status(404).json({ message: "User Not Found" });
    return;
  }
  const { password, ...safeUser } = user;
  res.status(200).json({ safeUser });
});

export const allUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();

  if (!users || users.length === 0) {
    res.status(404).json({ message: "No User" });
    return;
  }
  const safeUsers = users.map(
    ({ password, ...userWithoutPassword }) => userWithoutPassword
  );
  res.status(200).json({ safeUsers });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, image, email, phone } = req.body;
  const { id } = req.params;
  const userId = parseInt(id, 10);
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        image,
        email,
        phone,
      },
    });
    if (!findUser) {
      res.status(404).json("User not Found");
    }
    res.status(200).json({ updatedUser });
  } catch (error: any) {
    throw new Error(error);
  }
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = parseInt(id);

  const deletedUser = await prisma.user.delete({
    where: {
      id: userId,
    },
  });
  if (!deletedUser) {
    res.status(404).json({ message: "User not Found" });
    return;
  }
  res.status(200).json({ deletedUser });
});
