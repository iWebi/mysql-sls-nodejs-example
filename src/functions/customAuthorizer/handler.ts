import { authorize } from "@libs/auth";
import { APIGatewayEvent } from "aws-lambda";

exports.handler = async (event: APIGatewayEvent) => {
  return await authorize(event);
};
