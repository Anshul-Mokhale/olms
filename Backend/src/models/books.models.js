import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
    {
        bookImg: {
            type: String,
        },
        name: {
            type: String,
            required: true,
            index: true,
        },
        author: {
            type: String,
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ["issued", "available", "not-available"],
            required: true,
        }
    }
);

export const Book = mongoose.model("Book", bookSchema);
