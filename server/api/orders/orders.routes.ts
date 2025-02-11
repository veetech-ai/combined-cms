import { Router } from 'express';
import * as orderController from './orders.controller';

const router = Router();

// All routes are public (no auth required)
router.get('/:orderId', orderController.getOrder);
router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.put('/:orderId', orderController.updateOrder);
router.delete('/:orderId', orderController.deleteOrder);

export default router;
