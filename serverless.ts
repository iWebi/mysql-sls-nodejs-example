import type { AWS } from "@serverless/typescript";
import functions from "./functions";
import iamRoleStatements from "./iamRoleStatements";
import plugins from "./plugins";

const serverlessConfiguration: AWS = {
  service: "mysql-sls-nodejs-example-apis",
  frameworkVersion: "3",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: false,
    },
    prune: {
      automatic: true,
      number: 3,
    },
    useDocker: true,
  },
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      description: "MySQL Serverless Example APIs",
    },
    logRetentionInDays: 14,
    logs: {
      restApi: {
        accessLogging: true,
        executionLogging: true,
        level: "INFO",
        format:
          '{"requestId": "$context.requestId", "userAgent": "$context.identity.userAgent", "ip": "$context.identity.sourceIp", "caller": "$context.identity.caller", "user": "$context.identity.user", "requestTime": "$context.requestTime", "httpMethod": "$context.httpMethod", "resourcePath": "$context.resourcePath", "status": "$context.status", "protocol": "$context.protocol", "responseLength": "$context.responseLength" }',
      },
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
    iamRoleStatements,
    tracing: {
      lambda: true,
      apiGateway: true,
    },
  },
  package: {
    individually: true,
  },
  layers: {
    nodejs: {
      name: "nodejs",
      path: "layer",
      description: "API NodeJS dependencies with aws-sdk v3",
      compatibleRuntimes: ["nodejs20.x"],
    },
  },
  plugins,
  functions,
};

module.exports = serverlessConfiguration;
