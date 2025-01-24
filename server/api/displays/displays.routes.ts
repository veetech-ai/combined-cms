import express from 'express';
import { getDisplays, createDisplay, updateDisplay, deleteDisplay } from './displays.controller';

const router = express.Router();

router.get('/', getDisplays);
router.post('/', createDisplay);
router.put('/:id', updateDisplay);
router.delete('/:id', deleteDisplay);

export default router; 