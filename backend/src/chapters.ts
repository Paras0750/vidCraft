import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_SECRET_KEY });

export const createChapters = async (vttFilePath: string, videoId: string) => {
  console.log("Generating chapters from the subtitles");

  const vttFile = fs.readFileSync(vttFilePath, "utf-8");

  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that receives video\'s subtitles in vtt as input and responds back with chapters for the video in the format:
                        [
                        { "title": "Introduction", "start": "0:00", "end": "01:34" },
                        { "title": "Chapter description", "start": "01:35", "end": "02:50" }
                        { "title": "Chapter description", "start": "02:50", "end": "03:51" }
                        { "title": "Chapter description", "start": "03:52", "end": "07:45" }
                        ..
                        { "title": "Outro", "start": "07:46", "end": "10:45" }
                        ]
                        Your response should be a valid json without the codeblock formatting.`,
      },
      {
        role: "user",
        content: `Here is the subtitle file convert it into chapters: ${vttFile}`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  const chapters = response.choices[0].message.content;

  const outputFileName = `${videoId}-chapters.json`;
  const outputPath = path.join(__dirname, "storage", outputFileName);

  if (chapters) fs.writeFileSync(outputPath, chapters);

  return chapters;
};
