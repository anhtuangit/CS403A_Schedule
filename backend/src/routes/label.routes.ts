import express from 'express';
import { getLabels, getLabelById, createLabel, updateLabel, deleteLabel } from '../controllers/label.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getLabels);
router.get('/:id', getLabelById);

router.use(authenticate, isAdmin);
router.post('/', createLabel);
router.put('/:id', updateLabel);
router.delete('/:id', deleteLabel);

export default router;

