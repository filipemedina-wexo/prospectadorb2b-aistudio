import { Router } from 'express';
import authRoutes from './authRoutes.js';
import leadRoutes from './leadRoutes.js';
import listRoutes from './listRoutes.js';
import tagRoutes from './tagRoutes.js';
import userRoutes from './userRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);
router.use('/lists', listRoutes);
router.use('/tags', tagRoutes);
router.use('/users', userRoutes);

export default router;
