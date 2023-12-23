import mongoose, { Schema, Document } from 'mongoose';

interface Chapter {
  title: string;
  start: string;
  end: string;
}

interface VideoDocument extends Document {
  videoId: string;
  vttFilePath: string;
  videoTranscodePath: Record<string, string>;
  chapters: Chapter[];
  thumbnail: string;
}

const videoSchema = new Schema<VideoDocument>({
  videoId: { type: String, required: true },
  vttFilePath: { type: String, required: true },
  videoTranscodePath: { type: Object, required: true },
  chapters: [{ type: Object, required: true }], 
  thumbnail: { type: String, required: true },
});

const VideoModel = mongoose.model<VideoDocument>('Video', videoSchema);

export default VideoModel;
