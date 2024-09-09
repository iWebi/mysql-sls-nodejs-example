export default [
  {
    Effect: "Allow",
    Action: ["secretsmanager:GetSecretValue:*"],
    Resource: ["arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:nodejs-example/mysql*"],
  },
];
