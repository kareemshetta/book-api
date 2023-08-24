import cloudinary from "../../utils/cloudinary.js";
import BookModel from "../../module/book/book.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
export const createBook = asyncHandler(async (request, response, next) => {
  const { title } = request.body;
  if (await BookModel.findOne({ title })) {
    throw new Error(`book ${title} already exists`, { cause: 409 });
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    request.file.path,
    {
      folder: `${process.env.APP_NAME}/book`,
    }
  );

  request.body.coverImage = { secure_url, public_id };

  request.body.createdBy = request.decoded._id;
  const book = await BookModel.create(request.body);
  if (book) return response.status(201).json({ message: "done", book });
  else throw new Error("book isn's created check data you provide");
});

export const updateBook = asyncHandler(async (request, response, next) => {
  const { title } = request.body;
  const book = await BookModel.findById(request.params.id);
  if (!book) {
    throw new Error(` invalid bookId  `, { cause: 404 });
  }
  if (book.createdBy != request.decoded.id) {
    throw new Error(`you are not authorized  `, {
      cause: 401,
    });
  }
  if (title) {
    if (book.title === request.body.title) {
      throw new Error(`cannot update you have provided the same name  `, {
        cause: 409,
      });
    }
    if (await BookModel.findOne({ title })) {
      throw new Error(`this book name is already exists   `, {
        cause: 409,
      });
    }
  }

  if (request.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      request.file.path,
      {
        folder: `${process.env.APP_NAME}/book`,
      }
    );
    await cloudinary.uploader.destroy(book.image.public_id);
    request.body.coverImage = { secure_url, public_id };
  }
  const updatedbook = await BookModel.updateOne(request.body);

  if (updatedbook)
    return response.status(201).json({ message: "done", updatedbook });
  else throw new Error("book isn's updated check data you provide");
});

export const deleteBook = asyncHandler(async (request, response, next) => {
  const { id } = request.params;
  const book = await BookModel.findById(id);
  if (!book) {
    throw new Error(` invalid bookId  `, { cause: 404 });
  }
  if (book.createdBy != request.decoded.id) {
    throw new Error(`you are not authorized  `, {
      cause: 401,
    });
  }

  await cloudinary.uploader.destroy(book.coverImage.public_id);

  const deletedBook = await BookModel.findByIdAndDelete(id);

  if (deletedBook)
    return response.status(201).json({ message: "done", updatedbook });
  else
    throw new Error("book isn's updated check data you provide", {
      cause: 500,
    });
});

export const getAllbooks = asyncHandler(async (request, response, next) => {
  const books = await BookModel.find().populate({
    path: "createdBy",
    select: "userName email",
  });

  if (!books) throw new Error("there're no  books", { cause: 404 });
  books && response.status(200).json({ message: "success", books });
});

export const getSingleBook = asyncHandler(async (request, response, next) => {
  const { id } = request.params;
  const book = await BookModel.findById(id).populate({
    path: "createdBy",
    select: "userName email",
  });

  if (!book) throw new Error("there're no  book", { cause: 404 });
  book && response.status(200).json({ message: "success", book });
});
