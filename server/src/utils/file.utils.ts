import { createWriteStream, unlink } from "fs";
import shortId from "shortid";
import { FileUpload } from "graphql-upload";
import { UPLOAD_DIR } from "../config";
import { Publisher } from "type-graphql";
import { PubSubSessionPayload } from "../modules/file/resolver";
import { ProgressStatus } from "../modules/file/input";

export const singleUpload = async (
  upload: Promise<FileUpload>
  // publish: Publisher<PubSubSessionPayload<ProgressStatus>>
) => {
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

    // stream.on("data", (data) => {
    //   publish({ sessionId: "1", data: { progress: 0 } });
    // });

    stream.on("error", (error) => writeStream.destroy(error));

    stream.pipe(writeStream);
  });

  return { name: filename, url: storedFileUrl };
};
