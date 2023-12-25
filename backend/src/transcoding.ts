import ffmpeg from "fluent-ffmpeg";
import { Readable } from "stream";

import fs from "fs";
import path from "path";

export const transcodeVideo = async (inputBuffer: Buffer, videoId: string) => {
  const resolutions = [
    "256x144",
    "426x240",
    "640x360",
    "854x480",
    "1280x720",
    "1920x1080",
  ];
  const convertedVideos: { [key: string]: string } = {};

  for (const resolution of resolutions) {
    const outputFileName = `${videoId}-${resolution}.mp4`;
    const outputPath = path.join(__dirname, "uploads", outputFileName); 
    ensureDirectoryExists(outputPath);
    const readableStream = bufferToStream(inputBuffer);

    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        // .input("pipe:0") // Read from the stream
        .input(readableStream) // Pass the readable stream here
        .videoCodec("libx264")
        .audioCodec("aac")
        .size(resolution)
        .output(outputPath)
        .on("end", () => {
          convertedVideos[resolution] = outputPath;
          resolve();
        })
        .on("progress", (progress) => {
          console.log(`Progress (${resolution}): (${progress.frames} frames) `);
        })
        .on("error", (err) => {
          console.error("Error converting video:", err);
          reject(err);
        })
        .run();
    });
  }

  return convertedVideos;
};

function bufferToStream(buffer: Buffer) {
  const readable = new Readable();
  readable._read = () => {}; // Necessary to implement a readable stream
  readable.push(buffer); // Push the buffer into the stream
  readable.push(null); // Signal the end of the stream

  return readable;
}

const ensureDirectoryExists = (filePath: string) => {
  const directory = path.dirname(filePath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};
