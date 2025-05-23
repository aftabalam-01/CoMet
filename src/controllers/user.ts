import prisma from "../db/db_connection";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, phone, image, role, email, password } = req.body;
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (findUser) {
      res.status(400).json("User Already Exists");
    }
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password,
        role
      },
    });
    res.status(200).json({
      ...newUser,
      phone: newUser.phone.toString(),
    });
  } catch (error: any) {
    throw new Error(error);
  }
});
