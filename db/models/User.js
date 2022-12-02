import { model, Schema } from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";
const secret = process.env.SECRET;


const UserSchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      require: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "Only alphanumeric characters are allowed"],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
    },
    password: String,
    salt: String,
    fileSystems: [{ type: Schema.Types.ObjectId, ref: "" }],
  },
  {
    methods: {
      setPassword: function (password) {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.password = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
      },
      validatePassword: function (password) {
        const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
        return this.password === hash;
      },
      generateJWT: function () {
        let today = new Date();
        let exp = new Date(today);
        exp.setDate(today.getDate() + 60);

        return jwt.sign({
          id: this._id,
          username: this.username,
          exp: parseInt(exp.getTime() / 1000)
        }, secret)
      },
      toAuthJSON: function() {
        return {
          username: this.username,
          email: this.email,
          token: this.generateJWT(),
          fileSystems: this.fileSystems
        }
      }
    },
  }
);

export default model("User", UserSchema);
