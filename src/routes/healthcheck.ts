import { Router } from 'express';

const router = Router();

router.get('/healthcheck', (req, res) => res.end());

export default router;
