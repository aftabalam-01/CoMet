import prisma from "../db/db_connection";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

export const createTransport = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      email,
      phone,
      image,
      contactPerson,
      contactPhone,
      totalBoxes,
    } = req.body;
    const userId = (req as any).user?.id;
    const findtransport = await prisma.transport.findUnique({
      where: {
        email,
      },
    });

    if (findtransport) {
      res.status(409).json("transport already Exists");
      return;
    }

    const createdTransport = await prisma.transport.create({
      data: {
        name,
        phone,
        email,
        image,
        contactPerson,
        contactPhone,
        createdById: userId,
        totalBoxes,
      },
    });
    res.status(200).json({ createdTransport });
  }
);

export const createBulkTransport = asyncHandler(
  async (req: Request, res: Response) => {
    const transports = req.body;
    const userId = (req as any).user?.id;

    if (!Array.isArray(transports) || transports.length === 0) {
      res.status(404);
      throw new Error("Please provide Multiple transports details");
    }
    const formattedTransports = transports.map((transport: any) => ({
      name: transport.name,
      image: transport.image || null,
      email: transport.email,
      phone: transport.phone,
      contactPerson: transport.contactPerson || null,
      totalBoxes: transport.totalBoxes ?? null,
      contactPhone: transport.contactPhone || null,
      createdById: userId,
    }));
    await prisma.transport.createMany({
      data: formattedTransports,
      skipDuplicates: true,
    });

    res.status(201).json({
      success: true,
      message: `${formattedTransports.length} Transports created successfully.`,
    });
  }
);

export const getTransport = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = parseInt(id);
    try {
      const getTransport = await prisma.transport.findUnique({
        where: {
          id: userId,
          isDeleted: false,
        },
      });
      if (!getTransport) {
        res.status(404).json("Transport not Found");
        return;
      }

      res.status(200).json({ getTransport });
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

export const getTransports = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        name,
        totalBoxes,
        sort = "createdAt",
        page = "1",
        limit = "10",
      } = req.query as {
        name?: string;
        totalBoxes?: string;
        sort?: string;
        page?: string;
        limit?: string;
      };

      const filters: any = { isDeleted: false };
      if (name) {
        filters.name = { contains: name, mode: "insensitive" };
      }

      if (totalBoxes) {
        filters.totalBoxes = { equals: totalBoxes };
      }
      let orderBy: any = { createdAt: "desc" };

      const allowedSortFields = ["totalBoxes"];
      const isDescending = sort.startsWith("-");
      const sortField = isDescending ? sort.slice(1) : sort;
      if (allowedSortFields.includes(sortField)) {
        orderBy = { [sortField]: isDescending ? "desc" : "asc" };
      }

      const pageNum = Math.max(parseInt(page, 10) || 1, 1);
      const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
      const skip = (pageNum - 1) * limitNum;

      const [transports, total] = await prisma.$transaction([
        prisma.transport.findMany({
          where: filters,
          orderBy,
          skip,
          take: limitNum,
        }),

        prisma.transport.count({ where: filters }),
      ]);
      res.status(200).json({
        success: true,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        total,
        data: transports,
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

export const updateTransport = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
      name,
      image,
      email,
      phone,
      contactPerson,
      totalBoxes,

      contactPhone,
    } = req.body;
    const userId = parseInt(id);
    try {
      const findTransport = await prisma.transport.findUnique({
        where: {
          id: userId,
        },
      });
      if (!findTransport) {
        res.status(404).json("Transport not Found");
        return;
      }

      const updatedTransport = await prisma.transport.update({
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
        },
      });
      res
        .status(200)
        .json({ message: "Transport Updated Successfully", updatedTransport });
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

export const deleteTransport = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = parseInt(id);
    try {
      const findTransport = await prisma.transport.findUnique({
        where: {
          id: userId,
        },
      });

      if (!findTransport) {
        res.status(404).json("Transport not Found");
        return;
      }
      const deletedTransport = await prisma.transport.update({
        where: {
          id: userId,
        },
        data: {
          isDeleted: true,
        },
      });
      res
        .status(200)
        .json({ message: "Transport Deleted Successfully", deletedTransport });
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

export const deleteBulkTransport = asyncHandler(
  async (req: Request, res: Response) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400);
      throw new Error("Please provide an array of transport IDs to delete.");
    }
    const deleteBulk = await prisma.transport.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        isDeleted: true,
      },
    });
    res.status(200).json(`${deleteBulk.count} Transports Deleted Successfully`);
  }
);
