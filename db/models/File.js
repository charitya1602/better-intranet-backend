import mongoose, { Schema, model } from "mongoose";
import * as modelNames from "../modelNames.js";

const FileSchema = new Schema(
  {
    name: String,
    lastModified: Date,
    url: { type: String, index: true },
    description: String,
    isDirectory: Boolean,
    filesInside: [{ type: Schema.Types.ObjectId, ref: "" }],
  },
  {
    methods: {
      toJSON1: function () {
        return {
          _id: this._id,
          name: this.name,
          lastModified: this.lastModified,
          url: this.url,
          description: this.description,
          isDirectory: this.isDirectory,
          filesInside: this.filesInside,
        };
      },
      toJSON2: async function () {
        if(!this.isDirectory) {
          return this.toJSON1();
        }
        const files = (await mongoose.model(modelNames.FILE).find({
          _id: { $in : this.filesInside }
        })).map(e => e.toJSON1());
        return {
          _id: this._id,
          name: this.name,
          lastModified: this.lastModified,
          url: this.url,
          description: this.description,
          isDirectory: this.isDirectory,
          files,
        };
      },
    },
  }
);

export default model(modelNames.FILE, FileSchema);
