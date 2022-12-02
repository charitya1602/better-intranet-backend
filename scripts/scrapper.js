import axios from "axios";
import { load } from "cheerio";
import fileModel from "../db/models/File.js";
import fileSystemModel from "../db/models/FileSystem.js";

const url = process.argv[2];

const indexUrl = async (url) => {
  url = url.split("?")[0];
  const { data } = await axios.get(url);
  const documentIds = [];
  const $ = load(data);
  const files = $("tr:nth-child(n+4):not(:last-child)");
  try {
    for (let file of files) {
      const fileUrlRel = $("a", file.children[1]).attr().href;
      const fileUrlAbs = `${url}/${fileUrlRel}`;
      const name = $("a", file.children[1]).text();
      const lastModified = $(file.children[2]).text();
      const fileSize = $(file.children[3]).text();
      const isDirectory = fileUrlRel[fileUrlRel.length - 1] == "/";
      let subDirs = isDirectory ? await indexUrl(fileUrlAbs) : null;
      const fileDocument = new fileModel({
        url: fileUrlAbs,
        name,
        lastModified,
        fileSize,
        isDirectory,
        filesInside: subDirs,
      });
      documentIds.push(fileDocument._id);
      await fileDocument.save();
    }
    return documentIds;
  } catch (e) {
    console.error(e);
  }
};

export default async (url, description) => {
  url = url.split("?")[0];
  let fileSystemDocument = await fileSystemModel.findOne({ url });
  if (fileSystemDocument?.status === "Running") {
    return fileSystemDocument._id;
  }
  fileSystemDocument =
    fileSystemDocument ??
    new fileSystemModel({
      url,
      description,
    });
  fileSystemDocument.status = "Running";
  fileSystemDocument.save();
  indexUrl(url).then((files) => {
    fileSystemDocument.status = "Done";
    fileSystemDocument.files = files;
    fileSystemDocument.save();
  });
  return fileSystemDocument._id;
};
