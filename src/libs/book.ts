import { Logger } from "@aws-lambda-powertools/logger";
import { APIGatewayProxyResult } from "aws-lambda";
import { ulid } from "ulid";
import { addBook, deleteBookById, getBookById } from "./bookrepository";
import { Book } from "./types";
import { badRequestProxyResponse, errorProxyResponse, successProxyResponse } from "./utils";

const logger = new Logger();
export const add = async (payload: string): Promise<APIGatewayProxyResult> => {
  // TODO: add schema validation
  try {
    const book: Book = JSON.parse(payload ?? "") as Book;
    book.id = ulid();
    await addBook(book);
    logger.debug(`successfully added book: ${book}`);
    return successProxyResponse(book);
  } catch (err) {
    return errorProxyResponse(err);
  }
};

export const getById = async (bookId: string): Promise<APIGatewayProxyResult> => {
  if (!bookId) {
    return badRequestProxyResponse("Missing book id path parameter");
  }
  try {
    const response = await getBookById(bookId);
    return successProxyResponse(response);
  } catch (err) {
    return errorProxyResponse(err);
  }
};

export const deleteById = async (bookId: string): Promise<APIGatewayProxyResult> => {
  if (!bookId) {
    return badRequestProxyResponse("Missing book id path parameter");
  }
  try {
    const response = await deleteBookById(bookId);
    return successProxyResponse(response);
  } catch (err) {
    return errorProxyResponse(err);
  }
};
