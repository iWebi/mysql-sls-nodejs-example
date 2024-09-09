import { getById } from "@libs/book";
import { APIGatewayEvent } from "aws-lambda";

exports.handler = async (event: APIGatewayEvent) => {
  const pathParameters = event.pathParameters;
  return await getById(pathParameters.bookId);
};
