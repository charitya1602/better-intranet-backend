import { model, Schema } from "mongoose";
import * as modelNames from "../modelNames.js";
import File from "./File.js";

const fileSystemSchema = new Schema(
  {
    url: String,
    lastRefreshed: { type: Date, default: Date.now },
    description: String,
    files: [{ type: Schema.Types.ObjectId, ref: "" }],
    status: String,
  },
  {
    methods: {
      toJSON1: function () {
        return {
          url: this.url,
          lastRefreshed: this.lastRefreshed,
          description: this.description,
          files: this.files,
          status: this.status,
        };
      },
      toJSON2: async function () {
        const files = (
          await File.find({
            _id: { $in: this.files },
          })
        ).map((e) => e.toJSON());
        return {
          url: this.url,
          lastRefreshed: this.lastRefreshed,
          description: this.description,
          files,
          status: this.status,
        };
      },
    },
  }
);

export default model(modelNames.FILE_SYTEM, fileSystemSchema);
