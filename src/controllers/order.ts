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

export const viewOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const orderId = parseInt(id);
  try {
    const findOrder = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
    if (!findOrder) {
      res.status(404).json("Order not Found");
      return;
    }
    res.status(200).json({ Order: findOrder });
  } catch (error: any) {
    throw new Error(error);
  }
});
