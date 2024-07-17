import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.models.js";
import { Book } from "../models/books.models.js";
import { Transaction } from "../models/transaction.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const admin = await Admin.findById(userId);
        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();

        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token");
    }
};

const registerAdmin = asyncHandler(async (req, res) => {
    const { username, name, email, password, contact } = req.body;

    // checking whether any field is empty
    if ([username, name, email, password, contact].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // checking whether admin is already created or not
    const existedAdmin = await Admin.findOne({ email });

    if (existedAdmin) {
        throw new ApiError(409, "User with email already exists");
    }

    // if everything is fine then create the admin
    const admin = await Admin.create({
        username,
        name,
        email,
        password,
        contact,
    });

    const createdAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

    if (!createdAdmin) {
        throw new ApiError(500, "Something went wrong while registering the Admin");
    }

    return res.status(201).json(
        new ApiResponse(200, createdAdmin, "Admin registered Successfully")
    );
});

const loginAdmin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username) {
        throw new ApiError(404, "Admin not found");
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await admin.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Admin Credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(admin._id);

    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: false
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    admin: loggedInAdmin, accessToken, refreshToken
                },
                "Admin logged In Successfully"
            )
        );
});

const createUser = asyncHandler(async (req, res) => {
    const { username, name, email, password, contact } = req.body;

    if ([username, name, email, password, contact].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ username });

    if (existedUser) {
        throw new ApiError(401, "User already exists!");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        name,
        email,
        password: hashPassword,
        contact
    });

    const createdUser = await User.findById(user._id);
    if (!createdUser) {
        throw new ApiError(409, "User Creation Error!");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    );
});

const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        throw new ApiError(409, "userId not found");
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
        throw new ApiError(400, "The user failed to delete!");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedUser, "User Removed Successfully")
    );

})

const addBooks = asyncHandler(async (req, res) => {
    const { name, author, status } = req.body;

    if (
        [name, author, status].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const bookImgLocalpath = req.file?.path;

    if (!bookImgLocalpath) {
        throw new ApiError(400, "Book Image file is required");
    }

    const bookImg = await uploadOnCloudinary(bookImgLocalpath);

    if (!bookImg) {
        throw new ApiError(400, "Book Image file is required");
    }

    const book = await Book.create({
        bookImg: bookImg.url,
        name,
        author,
        status
    });

    const enteredBook = await Book.findById(book._id);

    if (!enteredBook) {
        throw new ApiError(500, "Something went wrong while inserting book");
    }

    return res.status(201).json(
        new ApiResponse(200, enteredBook, "Book Inserted Successfully")
    );
});

const removeBooks = asyncHandler(async (req, res) => {
    const { bookId } = req.body;

    if (!bookId) {
        throw new ApiError(400, "Book ID is required");
    }

    const book = await Book.findByIdAndDelete(bookId);

    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    return res.status(200).json(
        new ApiResponse(200, book, "Book Removed Successfully")
    );
});

// function for searcing books

const searchBook = asyncHandler(async (req, res) => {
    const { name, author, status } = req.query;

    // Build the query object
    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' }; // case-insensitive search
    if (author) query.author = { $regex: author, $options: 'i' }; // case-insensitive search
    if (status) query.status = status;

    // Search for books in the database
    const books = await Book.find(query);

    if (!books || books.length === 0) {
        throw new ApiError(404, "No books found matching the search criteria");
    }

    return res.status(200).json(
        new ApiResponse(200, books, "Books fetched successfully")
    );
});

const issueBook = asyncHandler(async (req, res) => {
    const { bookId, userId, status, dueDate } = req.body;

    if (
        [bookId, userId, status, dueDate].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // check availability status
    const bookDetail = await Book.findById(bookId);

    if (!bookDetail) {
        throw new ApiError(404, "Book not found");
    }

    if (bookDetail.status == 'available') {
        const history = await Transaction.create({
            userDetail: userId,
            bookDetail: bookId,
            status: "issued",
            dueDate
        })

        const histrodyCheck = await Transaction.findById(history._id);

        if (!histrodyCheck) {
            throw new ApiError(400, "the transaction is not created");
        } else {
            bookDetail.status = status;
            await bookDetail.save();
        }
    } else {
        throw new ApiError(400, "Book is not available for issuing");
    }

    return res.status(200).json(
        new ApiResponse(200, bookDetail, "Book issued successfully")
    );
});

const returnBook = asyncHandler(async (req, res) => {
    const { bookId, userId, status } = req.body;

    if (
        [bookId, status].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if the book exists
    const bookDetail = await Book.findById(bookId);

    if (!bookDetail) {
        throw new ApiError(404, "Book not found");
    }

    // Check if the book is issued
    if (bookDetail.status !== status) {
        throw new ApiError(400, "Book is not currently issued");
    }

    // Find the transaction history
    const history = await Transaction.findOne({ bookDetail: bookId });

    if (!history) {
        throw new ApiError(400, "The transaction not found");
    }

    // Update the transaction status to returned
    history.status = 'returned';
    await history.save();

    // Update the book status to available
    bookDetail.status = 'available';
    await bookDetail.save();

    return res.status(200).json(
        new ApiResponse(200, bookDetail, "Book returned successfully")
    );
});

// fetch the data analytics

const getAnalysis = asyncHandler(async (req, res) => {
    // Fetch total number of books
    const totalBooks = await Book.countDocuments();

    // Fetch total number of users
    const totalUsers = await User.countDocuments();

    // Fetch total number of issued books
    const totalIssuedBooks = await Book.countDocuments({ status: 'issued' });

    // Fetch total number of transactions
    const totalTransactions = await Transaction.countDocuments();

    return res.status(200).json(
        new ApiResponse(200, { totalBooks, totalUsers, totalIssuedBooks, totalTransactions }, "Statistics fetched successfully")
    );
})

// list of all users

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");

    if (!users) {
        throw new ApiError(404, "No users found");
    }

    return res.status(200).json(
        new ApiResponse(200, users, "List of all users fetched successfully")
    );
});

// list of all books
const getAllBooks = asyncHandler(async (req, res) => {
    const books = await Book.find();

    if (!books) {
        throw new ApiError(404, "No users found");
    }

    return res.status(200).json(
        new ApiResponse(200, books, "List of all books fetched successfully")
    );
});

// get all history of transaction

const getAllTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.find();

    if (!transaction) {
        throw new ApiError(404, "No Data Found!");
    }

    return res.status(200).json(
        new ApiResponse(201, transaction, "List of all Transaction")
    )
})

const fetchUserTransactions = asyncHandler(async (req, res) => {
    const { username } = req.body;

    if (!username) {
        throw new ApiError(400, "Username is required");
    }

    // Search for the user in the database by username
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Fetch transactions using the user's ID
    const transactions = await Transaction.find({ userDetail: user._id });

    return res.status(200).json(
        new ApiResponse(200, { transactions }, "Transactions fetched successfully")
    );
});

export {
    registerAdmin,
    loginAdmin,
    createUser,
    deleteUser,
    addBooks,
    removeBooks,
    searchBook,
    issueBook,
    returnBook,
    getAnalysis,
    getAllUsers,
    getAllBooks,
    getAllTransaction,
    fetchUserTransactions
};
