import defaultSettings from "@functions/defaultsettings";
import { handlerPath } from "@libs/handlerresolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  layers: [{ Ref: "NodejsLambdaLayer" }],
  name: "getBookById",
  events: [
    {
      http: {
        method: "get",
        path: "v1.0/book/{bookId}",
        ...defaultSettings,
        request: {
          parameters: {
            paths: {
              bookId: true,
            },
          },
        },
      },
    },
  ],
};
