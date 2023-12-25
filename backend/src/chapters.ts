import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Tiktoken } from "tiktoken/lite";
import cl100k_base from "tiktoken/encoders/cl100k_base.json";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_SECRET_KEY });

const encoding = new Tiktoken(
  cl100k_base.bpe_ranks,
  cl100k_base.special_tokens,
  cl100k_base.pat_str
);
const tokenLimit = 3500; // Adjust the token limit as needed

export const createChapters = async (vttFilePath: string, videoId: string) => {
  console.log("Generating chapters from the subtitles");

  const vttFileContent = fs.readFileSync(vttFilePath, "utf-8");
  const vttChunks = chunkVttFile(vttFileContent, encoding, tokenLimit); // Adjust the chunk size as needed

  let context = "";
  let allChapters = []; // Initialize an array to hold all chapters

  for (const chunk of vttChunks) {
    console.log("---->>> Generating chapters for chunk");
    await sleep(3000); // Add a delay of 3 seconds between each chunk
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that receives video\'s subtitles in vtt as input and responds back with chapters for complete video in the format:
                      [
                        { "title": "Introduction", "start": "00:00:00.000", "end": "00:00:01:34" },
                        { "title": "Chapter description", "start": "00:00:01:35", "end": "00:00:02:50" }
                        { "title": "Chapter description", "start": "00:00:02:50", "end": "00:00:03:51" }
                        { "title": "Chapter description", "start": "00:00:03:52", "end": "00:00:07:45" }
                        ..
                        { "title": "Outro", "start": "00:00:07:46", "end": "00:00:10:45" }
                      ]

                      I might give you files in parts Your response should be 2-3 meaningful chapters
                      Your response should be a valid json without the codeblock formatting.`
        },
        {
          role: "user",
          content: `Here is the subtitle chunk: ${chunk}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    if (!response.choices[0].message.content) {
      console.error("No response content found");
      // Handle the error or return an appropriate value
      return [];
    }

    const chapters = JSON.parse(response.choices[0].message.content);

    for (const chapter of chapters) {
      allChapters.push(chapter);
    }
  }

  const outputFileName = `${videoId}-chapters.json`;
  const outputPath = path.join(__dirname, "storage", outputFileName);

  if (allChapters.length > 0)
    fs.writeFileSync(outputPath, JSON.stringify(allChapters, null, 2));

  return allChapters;
};

// Function to split the VTT file into chunks as limit is 4097 tokens
function chunkVttFile(vttContent: string, encoding: any, tokenLimit: number) {
  const chunks = [];
  let currentChunk = "";
  let currentChunkTokens = 0;

  const lines = vttContent.split("\n");

  for (const line of lines) {
    const lineTokens = encoding.encode(line).length;

    if (currentChunkTokens + lineTokens <= tokenLimit) {
      currentChunk += line + "\n";
      currentChunkTokens += lineTokens;
    } else {
      chunks.push(currentChunk.trim());
      currentChunk = line + "\n";
      currentChunkTokens = lineTokens;
    }
  }

  if (currentChunk.trim() !== "") {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); // Fix Rate Limiting issue
