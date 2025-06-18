import prisma from "../db/db_connection";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const {
    shopId,
    boxes,
    billno,
    note,
    lr,
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
      lr,
      transportId,
      createdById,
      deliveryStatus,
      payment,
    },
  });
  res.status(200).json({ createdOrder });
});

export const batchOrder = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { orders } = req.body;
    const createdById = req.user.id;

    if (!Array.isArray(orders) || orders.length === 0) {
      res.status(400).json({ message: "Orders should be Array" });
      return;
    }

    const createBatchOrders = orders.map((orders) => ({
      ...orders,
      createdById,
    }));
    const result = await prisma.order.createMany({ data: createBatchOrders });
    res.status(200).json({ success: true, count: result.count });
  }
);

export const viewOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const orderId = parseInt(id);
  try {
    const findOrder = await prisma.order.findUnique({
      where: {
        id: orderId,
        isDeleted: false,
      },
      include: {
        shops: { select: { name: true } },
        transports: { select: { name: true } },
        createdBy: { select: { name: true } },
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
  const orders = await prisma.order.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    include: {
      shops: { select: { name: true } },
      transports: { select: { name: true } },
      createdBy: { select: { name: true } },
    },
  });
  res.status(200).json({ orders });
});
export const groupedOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const orders = await prisma.order.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      include: {
        shops: { select: { name: true } },
        transports: { select: { name: true } },
        createdBy: { select: { name: true } },
      },
    });

    const grouped = orders.reduce<Record<string, (typeof orders)[0][]>>(
      (acc, order) => {
        const dateKey = order.createdAt.toISOString().split("T")[0];
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(order);
        return acc;
      },
      {}
    );
    const sortedGrouped = Object.fromEntries(
      Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a))
    );
    res.status(200).json({ groupedOrders: sortedGrouped });
  }
);

export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const orderId = parseInt(id);
  const {
    shopId,
    boxes,
    billno,
    note,
    lr,
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
      lr,
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
  const deletedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      isDeleted: true,
    },
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
    const deleteBulk = await prisma.order.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: { isDeleted: true },
    });
    res.status(200).json(`${deleteBulk.count} Orders Deleted Successfully`);
  }
);
