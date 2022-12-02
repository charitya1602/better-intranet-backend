import { Router } from "express";
import jwtMiddleware from "../jwt.js";
import FileSystem from "../../db/models/FileSystem.js";
import File from "../../db/models/File.js";
import User from "../../db/models/User.js";
import indexServer from "../../scripts/scrapper.js";

const router = Router();

router.use(jwtMiddleware.required);
router.get("/", async (req, res) => {
  const { id } = req.payload;
  const user = await User.findById(id);
  res.send({
    fileSystems: user.fileSystems,
  });
});
router.get("/:fileSystemId", async (req, res) => {
  const { fileSystemId } = req.params;
  const fsys = await FileSystem.findById(fileSystemId);
  if (!fsys) {
    return res.sendStatus(404);
  }
  const fsysData = await fsys.toJSON2();
  res.send({ fsys: fsysData });
});
router.get("/:fileSystemId/:fileId", async (req, res) => {
  const { fileSystemId, fileId } = req.params;
  const fileNode = fileId ? await File.findById(fileId) : null;
  if (!fileNode) {
    return res.sendStatus(404);
  }
  const fsysData = await fileNode.toJSON2();
  res.send({ fsys: fsysData });
});

router.post("/", async (req, res) => {
  const { url, description } = req.body;
  let fsys = await indexServer(url, description);
  const { id } = req.payload;
  const user = await User.findById(id);
  await user.updateOne({ $addToSet: { fileSystems: fsys._id } });
  return res.send({ message: "File System added" });
});

router.get("/:fileSystemId/fuzzyfind", async (req, res) => {
  const { fileId, query } = req.body;
  const files = await fuzzyFind(fileId, query);
  res.send({
    files,
  });
});

export default router;
