import { Router } from 'express';
import { fetchUserTransaction, login } from '../controllers/user.controller.js';
const router = Router();


router.route('/login').post(
    login
)

router.route('/transaction').post(
    fetchUserTransaction
)

export default router;