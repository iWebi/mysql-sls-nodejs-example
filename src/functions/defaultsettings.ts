export default {
  authorizer: {
    name: "customAuthorizer",
    type: "request",
    identitySource: "method.request.header.authorization",
  },
  cors: {
    //TODO: * can be replaced with custom domain list as needed
    origin: "*",
    headers: [
      "Accept",
      "Origin",
      "User-Agent",
      "Referer",
      "Content-Type",
      "Authorization",
      "x-amz-security-token",
      "x-amz-date",
      "Access-Control-Allow-Origin",
    ],
  },
};
