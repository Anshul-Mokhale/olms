import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import { User } from "../models/user.models.js";
import { Transaction } from "../models/transaction.models.js";
import { Book } from "../models/books.models.js";

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if ([username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Error: data is empty");
    }

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Exclude the password from the user data
    const userData = await User.findById(user._id).select("-password");

    // Return the response with tokens and user data
    return res.status(200).json(
        new ApiResponse(200, { user: userData }, "User logged in successfully")
    );
});


const fetchUserTransaction = asyncHandler(async (req, res) => {
    const { userDetail } = req.body;

    if (!userDetail) {
        throw new ApiError(400, "No value inserted");
    }

    // Fetch all transactions associated with the user
    const transactions = await Transaction.find({ userDetail: userDetail });

    if (!transactions || transactions.length === 0) {
        throw new ApiError(404, "No transactions found for this user");
    }

    const userData = await User.findById(userDetail);
    if (!userData) {
        throw new ApiError(400, "No value Founded for user");
    }

    // Fetch the book data for each transaction
    const transactionsWithDetails = await Promise.all(transactions.map(async (transaction) => {
        const bookData = await Book.findById(transaction.bookDetail);
        if (!bookData) {
            throw new ApiError(400, "No value Founded for Books");
        }

        return {
            ...transaction.toObject(),
            userName: userData.name,
            bookName: bookData.name,
        };
    }));

    // Return the transactions with user and book details in the response
    return res.status(200).json(
        new ApiResponse(200, transactionsWithDetails, "Transactions fetched successfully")
    );
});


export { login, fetchUserTransaction };
