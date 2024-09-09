import { APIGatewayProxyResult } from "aws-lambda";
import { DEFAULT_RESPONSE_HEADERS } from "./constants";
import { AppError } from "./types";

export function setStatusType(code: any): string {
  switch (code) {
    case 400:
      return "Bad Request";
    case 401: // intentional UnAuthorized instead of Not Authenticated error
    case 403:
      return "UnAuthorized";
    case 404:
      return "Not Found";
    case 408:
      return "Request Timeout";
    case 500:
      return "Internal Server Error";
    default:
      return "";
  }
}

export function debug(message: string, ...optionalParams: any[]) {
  console.log(`DEBUG: ${message}`, optionalParams);
}

export function badRequestWith(message?: string): AppError {
  return {
    body: message ?? "",
    statusCode: 400,
    statusType: "Bad Request",
  };
}

export function internalServerErrorWith(message?: string): AppError {
  return {
    body: message ?? "",
    statusCode: 500,
    statusType: "Internal Server Error",
  };
}

export function errorProxyResponse(error: AppError): APIGatewayProxyResult {
  return {
    body: JSON.stringify(error),
    headers: DEFAULT_RESPONSE_HEADERS,
    statusCode: error.statusCode,
  };
}

export function badRequestProxyResponse(message?: string): APIGatewayProxyResult {
  return errorProxyResponse(badRequestWith(message));
}

export function successProxyResponse(data?: any, statusCode?: number): APIGatewayProxyResult {
  return {
    body: data ? JSON.stringify(data) : "",
    statusCode: statusCode ?? 200,
    headers: DEFAULT_RESPONSE_HEADERS,
    isBase64Encoded: false,
  };
}

export function isEmpty(value: any): boolean {
  return value === null || value === undefined;
}

export function isNonEmpty(value: any): boolean {
  return !isEmpty(value);
}
