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

export const viewOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany();
  res.status(200).json({ orders });
});

export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const orderId = parseInt(id);
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

  const findOrder = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });
  if (!findOrder) {
    res.status(404).json("Order not Found");
    return;
  }
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
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
  res.status(200).json({ updatedOrder });
});

export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const orderId = parseInt(id);

  const findOrder = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });
  if (!findOrder) {
    res.status(404).json("Order not Found");
    return;
  }
  const deletedOrder = await prisma.order.delete({
    where: { id: orderId },
  });
  res.status(200).json({ deletedOrder });
});

export const deleteBulkOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const ids = req.body.ids;

    if (!Array.isArray(ids) || ids.length == 0) {
      res.status(400);
      throw new Error("Please provide an array of shop IDs to delete.");
    }
    const deleteBulk = await prisma.order.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    res.status(200).json(`${deleteBulk.count} Orders Deleted Successfully`);
  }
);
