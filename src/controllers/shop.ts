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

export const createBulkShop = asyncHandler(
  async (req: Request, res: Response) => {
    const shops = req.body;
    const userId = (req as any).user?.id;

    if (!Array.isArray(shops) || shops.length === 0) {
      res.status(404);
      throw new Error("Please provide Multiple shops details");
    }
    const formattedShops = shops.map((shop: any) => ({
      name: shop.name,
      image: shop.image || null,
      email: shop.email,
      phone: shop.phone,
      contactPerson: shop.contactPerson || null,
      totalBoxes: shop.totalBoxes ?? null,
      billAmount: shop.billAmount ?? null,
      contactPhone: shop.contactPhone || null,
      createdById: userId,
    }));
    await prisma.shop.createMany({
      data: formattedShops,
      skipDuplicates: true,
    });

    res.status(201).json({
      success: true,
      message: `${formattedShops.length} shops created successfully.`,
    });
  }
);

export const getShop = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = parseInt(id);
  try {
    const getShop = await prisma.shop.findUnique({
      where: {
        id: userId,
        isDeleted: false,
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

    const filters: any = { isDeleted: false };
    if (name) {
      filters.name = { contains: name, mode: "insensitive" };
    }
    if (billAmount) {
      filters.billAmount = { equals: billAmount };
    }
    if (totalBoxes) {
      filters.totalBoxes = { equals: totalBoxes };
    }
    let orderBy: any = { createdAt: "desc" };

    const allowedSortFields = ["billAmount", "totalBoxes"];
    const isDescending = sort.startsWith("-");
    const sortField = isDescending ? sort.slice(1) : sort;
    if (allowedSortFields.includes(sortField)) {
      orderBy = { [sortField]: isDescending ? "desc" : "asc" };
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = (pageNum - 1) * limitNum;

    const [shops, total] = await prisma.$transaction([
      prisma.shop.findMany({ where: filters, orderBy, skip, take: limitNum }),

      prisma.shop.count({ where: filters }),
    ]);
    res.status(200).json({
      success: true,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      total,
      data: shops,
    });
  } catch (error: any) {
    throw new Error(error);
  }
});

export const updateShop = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    image,
    email,
    phone,
    contactPerson,
    totalBoxes,
    billAmount,
    contactPhone,
  } = req.body;
  const userId = parseInt(id);
  try {
    const findShop = await prisma.shop.findUnique({
      where: {
        id: userId,
      },
    });
    if (!findShop) {
      res.status(404).json("Shop not Found");
      return;
    }

    const updatedShop = await prisma.shop.update({
      where: {
        id: userId,
      },
      data: {
        name,
        image,
        phone,
        email,
        contactPerson,
        contactPhone,
        totalBoxes,
        billAmount,
      },
    });
    res.status(200).json({ message: "Shop Updated Successfully", updatedShop });
  } catch (error: any) {
    throw new Error(error);
  }
});

export const deleteShop = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = parseInt(id);
  try {
    const findShop = await prisma.shop.findUnique({
      where: {
        id: userId,
      },
    });

    if (!findShop) {
      res.status(404).json("Shop not Found");
      return;
    }
    const deletedShop = await prisma.shop.update({
      where: {
        id: userId,
      },
      data: {
        isDeleted: true,
      },
    });
    res.status(200).json({ message: "Shop Deleted Successfully", deletedShop });
  } catch (error: any) {
    throw new Error(error);
  }
});

export const deleteBulkShop = asyncHandler(
  async (req: Request, res: Response) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400);
      throw new Error("Please provide an array of shop IDs to delete.");
    }
    const deleteBulk = await prisma.shop.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        isDeleted: true,
      },
    });
    res.status(200).json(`${deleteBulk.count} Shops Deleted Successfully`);
  }
);
