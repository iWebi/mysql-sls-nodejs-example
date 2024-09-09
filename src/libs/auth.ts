import {
  APIGatewayEvent,
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayEventRequestContextWithAuthorizer,
  APIGatewayProxyEventHeaders,
} from "aws-lambda";

export async function authorize(event: APIGatewayEvent) {
  const authToken = findHeader("Authorization", event.headers);
  // TODO: add custom auth logic here
  // dummy logic for demo purpose
  console.log("authToken", authToken);
  if (authToken === "_t_o_k_e_n_") {
    return generatePolicy(event.requestContext);
  }
  // all other scenarios, invalid
  throw new Error("Unauthorized");
}

export function findHeader(headerName: string, headers: APIGatewayProxyEventHeaders): string | undefined {
  headerName = headerName?.toLocaleLowerCase();
  for (const property of Object.keys(headers)) {
    if (property.toLocaleLowerCase() === headerName) {
      return headers[property];
    }
  }
  return undefined;
}

export function generatePolicy(
  requestContext: APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>
) {
  let baseARN = `arn:aws:execute-api:${process.env.AWS_REGION}:${requestContext.accountId}:${requestContext.apiId}/${requestContext.stage}`;

  if (process.env.IS_OFFLINE) {
    // serverless offline is not passing accountId and apiId. Using defaults instead
    baseARN = `arn:aws:execute-api:${process.env.AWS_REGION}:random-account-id:random-api-id/${requestContext.stage}`;
  }

  const resources: string[] = [`${baseARN}/*/v*/*`];

  return {
    principalId: "fooUser",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: resources,
        },
      ],
    },
    context: {
      stringKey: "value",
      numberKey: "1",
      booleanKey: "true",
    },
    usageIdentifierKey: "{api-key}",
  };
}
