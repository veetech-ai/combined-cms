import { Router } from 'express';
import * as storeController from './stores.controller';

const router = Router();

router.get('/stores', storeController.getStores);

router.post('/stores', storeController.createStore);

router.put('/stores/:id', storeController.updateStore);

router.delete('/stores/:id', storeController.deleteStore);

export default router;
