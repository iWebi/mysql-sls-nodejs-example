import defaultSettings from "@functions/defaultsettings";
import { handlerPath } from "@libs/handlerresolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  layers: [{ Ref: "NodejsLambdaLayer" }],
  name: "deleteBookById",
  events: [
    {
      http: {
        method: "delete",
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
