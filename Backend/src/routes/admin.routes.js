import { Router } from 'express';
import { registerAdmin, loginAdmin, addBooks } from '../controllers/admin.controllers.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { upload } from '../middlewares/multer.middlewares.js';

const router = Router();

router.route('/register').post(
    registerAdmin
)

router.route('/login').post(
    loginAdmin
)

router.route('/add-book').post(
    verifyJWT,
    upload.single('bookImg'),
    addBooks
)

export default router;