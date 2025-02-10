import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { asyncHandler } from '../../util/asyn-handler';
import { ApiError } from '../../util/api.error';
import { io } from '../..';

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

interface OrderItem {
  id: number | string;
  name: { en: string; es: string };
  price: number;
  quantity: number;
  customization?: Record<string, string>;
  addons?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  extras?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  instructions?: string;
}

interface Order {
  orderId: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'completed'
    | 'cancelled';
  customerName: string;
  customerPhone: string;
  timestamp: string;
  items: OrderItem[];
  totalBill: string;
}

// Ensure the data directory exists
async function ensureDataDir() {
  const dir = path.dirname(ORDERS_FILE);
  await fs.mkdir(dir, { recursive: true });
}

// Read orders from file
async function readOrders(): Promise<Order[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(ORDERS_FILE, 'utf8');
    // Handle empty file case
    if (!data.trim()) {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid JSON, return empty array
    if (
      (error as NodeJS.ErrnoException).code === 'ENOENT' ||
      error instanceof SyntaxError
    ) {
      // Initialize the file with empty array if it doesn't exist or is invalid
      await writeOrders([]);
      return [];
    }
    throw error;
  }
}

// Write orders to file
async function writeOrders(orders: Order[]): Promise<void> {
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
  const newOrder = { ...req.body, status: 'pending' };

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

  console.log('Update Order Request:', {
    orderId,
    updateData,
    params: req.params,
    path: req.path
  });

  if (!orderId) {
    throw new ApiError(400, 'Missing orderId');
  }

  const orders = await readOrders();
  const index = orders.findIndex((o: any) => o.orderId === orderId);

  if (index === -1) {
    throw new ApiError(404, 'Order not found');
  }

  // Preserve existing order data and merge with updates
  orders[index] = {
    ...orders[index],
    ...updateData,
    // Ensure these fields are not accidentally overwritten
    orderId: orders[index].orderId,
    items: orders[index].items,
    totalBill: orders[index].totalBill,
    timestamp: orders[index].timestamp
  };

  await writeOrders(orders);

  // Emit socket event only if status is updated
  if (updateData.status) {
    io.emit('orderStatusUpdated', {
      orderId,
      status: updateData.status
    });
  }

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
