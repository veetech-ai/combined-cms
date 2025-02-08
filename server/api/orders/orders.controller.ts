import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { asyncHandler } from '../../util/asyn-handler';
import { ApiError } from '../../util/api.error';

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

// Ensure the data directory exists
async function ensureDataDir() {
  const dir = path.dirname(ORDERS_FILE);
  await fs.mkdir(dir, { recursive: true });
}

// Read orders from file
async function readOrders() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Write orders to file
async function writeOrders(orders: any[]) {
  await ensureDataDir();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const orders = await readOrders();
  const order = orders.find((o: any) => o.orderId === orderId);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  res.json(order);
});

export const getAllOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const orders = await readOrders();
    res.json(orders);
  }
);

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const newOrder = req.body;

  if (!newOrder.orderId) {
    throw new ApiError(400, 'Order ID is required');
  }

  const orders = await readOrders();

  // Check if order with same ID already exists
  if (orders.some((o: any) => o.orderId === newOrder.orderId)) {
    throw new ApiError(400, 'Order with this ID already exists');
  }

  orders.push(newOrder);
  await writeOrders(orders);

  res.status(201).json(newOrder);
});

export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const updateData = req.body;

  const orders = await readOrders();
  const index = orders.findIndex((o: any) => o.orderId === orderId);

  if (index === -1) {
    throw new ApiError(404, 'Order not found');
  }

  orders[index] = { ...orders[index], ...updateData };
  await writeOrders(orders);

  res.json(orders[index]);
});

export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const orders = await readOrders();
  const filteredOrders = orders.filter((o: any) => o.orderId !== orderId);

  if (orders.length === filteredOrders.length) {
    throw new ApiError(404, 'Order not found');
  }

  await writeOrders(filteredOrders);
  res.status(204).send();
});
