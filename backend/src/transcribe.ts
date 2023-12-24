import axios from "axios";
import FormData from "form-data";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";

export const transcribeMedia = async (
  buffer: Buffer,
  fileName: string,
  videoId: string
) => {
  const fileExtension = fileName.split(".").pop()?.toLowerCase();
  const supportedFormats = [
    "flac",
    "mp3",
    "mp4",
    "mpeg",
    "mpga",
    "m4a",
    "ogg",
    "wav",
    "webm",
  ];

  if (!fileExtension || !supportedFormats.includes(fileExtension)) {
    throw new Error(`Unsupported file format: ${fileExtension}`);
  }

  const uploadDir = path.join(__dirname, "storage");

  const formData = new FormData();
  formData.append("file", buffer, {
    filename: fileName,
    contentType: `audio/${fileExtension}`,
  });
  formData.append("model", "whisper-1");
  formData.append("language", "en");
  formData.append("response_format", "vtt"); // Specify VTT as the response format

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_SECRET_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );
    console.log("response", response.data);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const vttFilePath = path.join(uploadDir, `${videoId}-subtitle.vtt`);
    fs.writeFileSync(vttFilePath, response.data);

    return vttFilePath;
  } catch (error: any) {
    console.log("error message: ", error.message);
    
    throw error;
  }
};
