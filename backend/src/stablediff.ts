import fetch from "node-fetch";
import FormData from "form-data";
import fs from "node:fs";
import path from "node:path";
import { mkdir } from "node:fs";
import Jimp from "jimp";
import { title } from "node:process";

const engineId: string = "stable-diffusion-xl-1024-v1-0";
const apiHost: string = process.env.API_HOST ?? "https://api.stability.ai";
const apiKey: string = process.env.STABILITY_API_KEY || "";

if (!apiKey) throw new Error("Missing Stability API key.");
const initImgPath: string = path.join(__dirname, "./ImageInitial.jpeg");
const imgMask: string = path.join(__dirname, "./ImageMask.jpeg");
const outDir: string = path.join(__dirname, `storage`);

export const generateThumbnail = async (
  videoId: string,
  thumbnailTitle: string,
  thumbnailPrompt?: string
): Promise<string> => {
  mkdir(outDir, { recursive: true }, (err: NodeJS.ErrnoException | null) => {
    if (err) throw err;
  });

  const propmt =
    thumbnailPrompt ||
    `Create a captivating visual representation of the wonders of computer science and technology, exploring the dynamic interplay between algorithms, data, and innovation`;
  const formData: FormData = new FormData();
  formData.append("init_image", fs.readFileSync(initImgPath));
  formData.append("mask_image", fs.readFileSync(imgMask));
  formData.append("mask_source", "MASK_IMAGE_WHITE");
  formData.append("text_prompts[0][text]", `${propmt}`);
  formData.append("text_prompts[0][weight]", "1");
  formData.append("text_prompts[1][text]", "blury,distorted");
  formData.append("text_prompts[1][weight]", "-1");

  formData.append("cfg_scale", "20");
  formData.append("clip_guidance_preset", "FAST_BLUE");
  formData.append("samples", "1");
  formData.append("steps", "30");

  const response = await fetch(
    `${apiHost}/v1/generation/${engineId}/image-to-image/masking`,
    {
      method: "POST",
      headers: {
        ...formData.getHeaders(),
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Non-200 response: ${await response.text()}`);
  }

  interface GenerationResponse {
    artifacts: Array<{
      base64: string;
      seed: number;
      finishReason: string;
    }>;
  }

  const responseJSON: GenerationResponse =
    (await response.json()) as GenerationResponse;

  const fileName: string = `${videoId}-thumbnail.png`;

  responseJSON.artifacts.forEach(async (image) => {
    const generatedImagePath: string = path.join(outDir, fileName);

    const generatedImage: Jimp = await Jimp.read(
      Buffer.from(image.base64, "base64")
    );

    const text: string = thumbnailTitle;
    if (text) {
      await addTextWithYellowBoxToImage(generatedImage, text);
    }

    await generatedImage.writeAsync(generatedImagePath);
  });

  return fileName;
};

async function addTextWithYellowBoxToImage(
  image: Jimp,
  text: string
): Promise<void> {
  const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);

  const wrapWidth: number = 750;
  const wrapHeight: number = Jimp.measureTextHeight(font, text, wrapWidth) + 20;

  const textX: number = 80;
  const textY: number = 280;
  const boxX: number = textX - 10;
  const boxY: number = textY - 10;

  image.scan(boxX, boxY, wrapWidth + 20, wrapHeight + 20, function (x, y, idx) {
    this.bitmap.data.writeUInt32BE(0xffff00ff, idx);
  });

  image.print(
    font,
    textX,
    textY,
    {
      text: text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    wrapWidth
  );
}
