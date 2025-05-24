import prisma from "../db/db_connection";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { hashedPassword, comparePassword } from "../utils/hashPassword";
import { generateToken } from "../utils/jwtToken";
import { generateRefreshToken } from "../utils/refreshToken";

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
    const hash = await hashedPassword(password);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        image,
        phone,
        password: hash,
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
    throw new Error("Invalid Email or Password");
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
    maxAge: 72 * 60 * 60 * 1000, // 3 days
  });

  const { password: _, ...safeUser } = updatedUser;

  res.status(200).json({
    message: "Login successful",
    user: safeUser,
    
  });
});
