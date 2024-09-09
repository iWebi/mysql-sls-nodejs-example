import defaultSettings from "@functions/defaultsettings";
import { handlerPath } from "@libs/handlerresolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  layers: [{ Ref: "NodejsLambdaLayer" }],
  name: "addBook",
  events: [
    {
      http: {
        method: "post",
        path: "v1.0/book",
        ...defaultSettings,
      },
    },
  ],
};
