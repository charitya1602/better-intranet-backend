import { Router } from "express";
import User from "../../db/models/User.js";

const router = Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) {
    return res.status(400).send({
      message: "Invalid Input"
    })
  }
  User.findOne({ email }, (err, user) => {
    if (user) {
      if (user.validatePassword(password)) {
        res.send({
          message: "login succesful",
          user: user.toAuthJSON(),
        });
      } else {
        res.status(401).send({ message: "invalid credentials" });
      }
    } else {
      res.status(401).send({ message: "invalid credentials" });
    }
  });
});

router.post("/register", (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).send({
      message: "Invalid Input",
    });
  }
  User.findOne({ email }, (err, user) => {
    if (user) {
      res.send({
        message: "email already registered, please sign in",
      });
    } else {
      const newUser = new User({
        username,
        email,
      });
      newUser.setPassword(password);
      newUser
        .save()
        .then(() =>
          res.status(200).send({
            message: "registration successful",
            user: newUser.toAuthJSON(),
          })
        )
        .catch((e) => {
          console.error(e);
          res.status(500).send({
            message: "Error while registration",
          });
        });
    }
  });
});
export default router;
