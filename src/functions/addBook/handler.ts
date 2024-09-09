import { add } from "@libs/book";
import { APIGatewayEvent } from "aws-lambda";

exports.handler = async (event: APIGatewayEvent) => {
  return await add(event.body);
};
