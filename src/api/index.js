import express from 'express';

const router = express.Router();

router.use(import('./home'));
router.use(import('./post'));
router.use(import('./stats'));
router.use(import('./user'));

export default router;
