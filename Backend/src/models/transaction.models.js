import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const transactionSchema = new Schema(
    {
        userDetail: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        bookDetail: {
            type: Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["issued", "returned"],
        },
        dueDate: {
            type: Date,
            required: true,
        },
        issueDate: {
            type: Date,
            required: true,
        },
        returnDate: {
            type: Date
        }
    },
    { timestamps: true }
);

transactionSchema.plugin(mongooseAggregatePaginate);

export const Transaction = mongoose.model("Transaction", transactionSchema);
