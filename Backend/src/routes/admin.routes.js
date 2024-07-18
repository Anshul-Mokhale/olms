import { Router } from 'express';
import { registerAdmin, loginAdmin, createUser, addBooks, removeBooks, issueBook, returnBook, deleteUser, getAnalysis, getAllUsers, getAllBooks, getAllTransaction, searchBook, fetchUserTransactions, fetchUserNameAndBookName, getBookById, getTransactionByBook } from '../controllers/admin.controllers.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { upload } from '../middlewares/multer.middlewares.js';
const router = Router();

router.route('/register').post(
    registerAdmin
)

router.route('/login').post(
    loginAdmin
)

router.route('/register-user').post(
    verifyJWT,
    createUser
)

router.route('/delete-user').post(
    verifyJWT,
    deleteUser
)

router.route('/add-book').post(
    verifyJWT,
    upload.single('bookImg'),
    addBooks
)

router.route('/remove-book').post(
    verifyJWT,
    removeBooks
)

router.route('/search-book').get(
    verifyJWT,
    searchBook
)

router.route('/issue-book').post(
    verifyJWT,
    issueBook
)
router.route('/return-book').post(
    verifyJWT,
    returnBook
)

router.route('/fetch-data').get(
    verifyJWT,
    getAnalysis
)

router.route('/fetch-all-users').get(
    verifyJWT,
    getAllUsers
)

router.route('/fetch-all-books').get(
    verifyJWT,
    getAllBooks
)

router.route('/fetch-all-transaction').get(
    verifyJWT,
    getAllTransaction
)

router.route('/fetch-user-transaction').post(
    verifyJWT,
    fetchUserTransactions
)

router.route('/fetch-username-bookname').post(
    verifyJWT,
    fetchUserNameAndBookName
)

router.route('/get-book').post(
    verifyJWT,
    getBookById
)

router.route('/get-transaction-book').post(
    verifyJWT,
    getTransactionByBook
)

export default router;