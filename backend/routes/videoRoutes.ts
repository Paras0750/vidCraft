import { Router, Request, Response } from "express";
import VideoModel from "../models/VideoModel";
const app = Router();

app.get("/getFeed", (req: Request, res: Response) => {
  VideoModel.find({})
    .then((data) => {
      res.status(200).json({ success: true, data });
    })
    .catch((err) => {
      res.status(500).json({ success: false, error: err.message });
    });
});

app.get("/getVideo/:videoId", (req: Request, res: Response) => {
  const { videoId } = req.params;
  VideoModel.find({ videoId })
    .then((data) => {
      res.status(200).json({ success: true, data });
    })
    .catch((err) => {
      res.status(500).json({ success: false, error: err.message });
    });
});

export default app;
