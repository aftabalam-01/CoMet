import prisma from "../db/db_connection";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

export const createShop = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    email,
    phone,
    image,
    contactPerson,
    contactPhone,
    totalBoxes,
    billAmount,
  } = req.body;
  const userId = (req as any).user?.id;
  const findShop = await prisma.shop.findUnique({
    where: {
      email,
    },
  });

  if (findShop) {
    res.status(409).json("Shop already Exists");
    return;
  }

  const createdShop = await prisma.shop.create({
    data: {
      name,
      phone,
      email,
      image,
      contactPerson,
      contactPhone,
      createdById: userId,
      totalBoxes,
      billAmount,
    },
  });
  res.status(200).json({ createdShop });
});

export const getShop = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = parseInt(id);
  try {
    const getShop = await prisma.shop.findUnique({
      where: {
        id: userId,
      },
    });
    if (!getShop) {
      res.status(404).json("Shop Not Found");
      return;
    }

    res.status(200).json({ getShop });
  } catch (error: any) {
    throw new Error(error);
  }
});

export const getShops = asyncHandler(async (req: Request, res: Response) => {
  try {
    const {
      name,
      billAmount,
      totalBoxes,
      sort = "createdAt",
      page = "1",
      limit = "10",
    } = req.query as {
      name?: string;
      billAmount?: string;
      totalBoxes?: string;
      sort?: string;
      page?: string;
      limit?: string;
    };

    const filters: any = {};
    if (name) {
      filters.name = { contains: name, mode: "insensitive" };
    }
    if (billAmount) {
      filters.billAmount = { equals: billAmount };
    }
    if (totalBoxes) {
      filters.totalBoxes = { equals: totalBoxes };
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const shops = await prisma.shop.findMany({
      where: filters,
      orderBy: {
        [sort]: "desc",
      },
      skip,
      take: parseInt(limit),
    });
    const total = await prisma.shop.count({ where: filters });
    res
      .status(200)
      .json({ success: true, page: parseInt(page), total, data: shops });
  } catch (error: any) {
    throw new Error(error);
  }
});
