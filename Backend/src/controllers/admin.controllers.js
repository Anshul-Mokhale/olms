import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.models.js";
import { Book } from "../models/books.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"



const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const admin = await Admin.findById(userId)
        const accessToken = admin.generateAccessToken()
        const refreshToken = admin.generateRefreshToken()

        admin.refreshToken = refreshToken
        await admin.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerAdmin = asyncHandler(async (req, res) => {
    const { username, name, email, password, contact } = req.body;

    // checking weather any field is empty
    if (
        [username, name, email, password, contact].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    // checking wheather admin is already created or not
    const existedAdmin = await Admin.findOne({
        $or: [{ email }]
    })

    if (existedAdmin) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // if every thing is fine then create the admin
    const admin = await Admin.create({
        username,
        name,
        email,
        password,
        contact,
    })

    const createdAdmin = await Admin.findById(admin._id).select(
        "-password -refreshToken"
    )

    if (!createdAdmin) {
        throw new ApiError(500, "Something went wrong while registering the Admin")
    }

    return res.status(201).json(
        new ApiResponse(200, createdAdmin, "Admin registered Successfully")
    )
})

const loginAdmin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username) {
        throw new ApiError(404, "Admin not found");
    }

    const admin = await Admin.findOne({
        $or: [{ username }]
    })

    if (!admin) {
        throw new ApiError(404, "User does not exist")
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
    }

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
        )
})

const addBooks = asyncHandler(async (req, res) => {
    const { name, author, status } = req.body;

    if (
        [name, author, status].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const bookImgLocalpath = req.file?.path;

    if (!bookImgLocalpath) {
        throw new ApiError(400, "Book Image file is required")
    }

    const bookImg = await uploadOnCloudinary(bookImgLocalpath)

    if (!bookImg) {
        throw new ApiError(400, "Book Image file is required")
    }

    const book = await Book.create({
        bookImg: bookImg.url,
        name,
        author,
        status
    })

    const enteredBook = await Book.findById(book._id);

    if (!enteredBook) {
        throw new ApiError(500, "Something went wrong while inserting book")
    }

    return res.status(201).json(
        new ApiResponse(200, enteredBook, "Book Inserted Successfully")
    )
})


export {
    registerAdmin,
    loginAdmin,
    addBooks
}