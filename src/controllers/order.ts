import prisma from "../db/db_connection";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const {
    shopId,
    boxes,
    billno,
    note,
    transportId,
    createdById,
    deliveryStatus,
    payment,
  } = req.body;
  const createdOrder = await prisma.order.create({
    data: {
      shopId,
      boxes,
      billno,
      note,
      transportId,
      createdById,
      deliveryStatus,
      payment,
    },
  });
  res.status(200).json({ createdOrder });
});
