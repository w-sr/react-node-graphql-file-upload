import { createWriteStream, unlink } from "fs";
import shortId from "shortid";
import { FileUpload } from "graphql-upload";
import { UPLOAD_DIR } from "../config";

export const singleUpload = async (upload: Promise<FileUpload>) => {
  const { filename, createReadStream } = await upload;
  const stream = createReadStream();
  const storedFileName = `${shortId.generate()}-${filename}`;
  const storedFileUrl = `${UPLOAD_DIR}/${storedFileName}`;

  await new Promise((resolve, reject) => {
    const writeStream = createWriteStream(storedFileUrl);
    writeStream.on("finish", resolve);

    writeStream.on("error", (error) => {
      unlink(storedFileUrl, () => {
        reject(error);
      });
    });

    stream.on("error", (error) => writeStream.destroy(error));

    stream.pipe(writeStream);
  });

  return { name: filename, url: storedFileUrl };
};
