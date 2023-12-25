import express, { Request, Response } from "express";
import cors from "cors";
import { upload } from "../modules/multer";
import { transcribeMedia } from "./transcribe";
import { createChapters } from "./chapters";
import { generateThumbnail } from "./stablediff";
import { transcodeVideo } from "./transcoding";
import { connectToDatabase } from "../modules/db";
import VideoModel from "../models/VideoModel";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import videoRoutes from "../routes/videoRoutes";

const app = express();
const port = 3004;
connectToDatabase();

app.use(cors());

const uploadsPath = path.join(__dirname, "storage");
const videosPath = path.join(__dirname, "uploads");

app.use("/storage", express.static(uploadsPath));
app.use("/uploadedVideos", express.static(videosPath));
app.use("/api", videoRoutes);

app.post(
  "/upload",
  upload.single("video"),
  async (req: Request, res: Response) => {
    const videoId = uuidv4();
    const { title } = req.body;
    const { thumbnailTitle } = req.body;
    const { thumbnailPrompt } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileName = req.file.originalname;

    try {
      const vttFilePath = await transcribeMedia(
        req.file.buffer,
        fileName,
        videoId
      );
      const chapters = await createChapters(vttFilePath, videoId);
      const thumbnail = await generateThumbnail(videoId, thumbnailTitle, thumbnailPrompt);
      const videoTranscodePath = await transcodeVideo(req.file.buffer, videoId);

      console.log("VTT Path: ", vttFilePath);
      console.log("Final Path: ", videoTranscodePath);
      console.log("Chapters: ", chapters);

      const videoData = {
        videoId,
        title,
        vttFilePath,
        videoTranscodePath,
        chapters,
        thumbnail
      };

      const savedVideo = await VideoModel.create(videoData);
      console.log("Video data saved successfully:", savedVideo);

      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("Error in try block:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

app.get("/testThumbnail", async (req: Request, res: Response) => {
  const videoId = uuidv4();
  const thumbnailTitle = "Intro To Backend";
  const response = await generateThumbnail(videoId, thumbnailTitle);
  res.send(response);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
