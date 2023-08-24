import mongoose, { Schema, Types, model } from "mongoose";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      min: [2, "minimum length 2 char"],
      max: [20, "max length 2 char"],
    },
    overview: {
      type: String,
      required: [true, "overview is required"],
    },
    author: {
      type: String,
      required: [true, "author is required"],
    },

    publishDate: {
      type: Date,
      required: [true, "author is required"],
    },

    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    coverImage: { type: Object },
  },
  {
    timestamps: true,
  }
);

const bookModel = mongoose.models.Book || model("Book", bookSchema);
export default bookModel;
