# VidCraft

VidCraft is a versatile and efficient open-source project designed to enhance multimedia content by seamlessly combining video transcoding, transcription using OpenAI's Whisper, chapter generation using OpenAI's GPT-3.5-turbo, and thumbnail generation using Stable Diffusion. This project enables users to process MP4 files, ensuring compatibility, accessibility, and engaging visual representation.

## Key Features

1. **Video Transcoding (Fluent-FFmpeg):**
   - Convert MP4 files to various formats and resolutions for optimal compatibility and performance using Fluent-FFmpeg.
   - Transcode videos into different resolutions (e.g., 144p, 240p, 360p, 480p) to cater to diverse playback scenarios.
   - Format supported: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm.

2. **Transcription Engine (OpenAI's Whisper):**
   - Utilize OpenAI's Whisper for advanced speech-to-text algorithms to transcribe audio content accurately.
   - Support multiple languages for diverse user needs.
   - **Note:** By default, the Whisper API only supports files that are less than 25 MB.

3. **Chapter Generation (GPT-3.5-turbo):**
   - Leverage the power of OpenAI's GPT-3.5-turbo model to generate informative chapters based on video content.
   - Enhance user experience with automatically generated chapter summaries for easier navigation and content understanding.

4. **Thumbnail Generation using Stable Diffusion:**
   - Implement Stable Diffusion algorithms for generating high-quality thumbnails.
   - Ensure visually appealing and representative thumbnails for improved content navigation.

## Thumbnail Generation Challenges and Solutions

### AI Thumbnail Generation Limitations
Despite extensive experimentation with various AI models for thumbnail generation, it has been observed that existing models struggle to incorporate text into generated thumbnails effectively. Multiple attempts with different prompts did not yield satisfactory results.

### Current Solution
As a workaround, VidCraft has implemented a solution using Stability AI with a mask image. The text is added to the generated image using the Jimp library. While this solution is functional, the project acknowledges the need for a more seamless and efficient alternative.

### Future Improvements
The project is actively exploring and evaluating alternative AI models and approaches for thumbnail generation that can incorporate text more effectively. The aim is to enhance the overall aesthetic and informational value of thumbnails, providing users with an engaging visual representation of the video content.

## Prompt Customization for Improved Results

- **Experiment with Prompts:**
  - The GPT-3.5-turbo model's performance can be enhanced by experimenting with different prompts. Feel free to tweak prompts to achieve more meaningful and relevant chapter summaries.

- **Optimize Thumbnail Generation:**
  - Fine-tune parameters and inputs for Stable Diffusion to achieve the desired visual style for generated thumbnails.

### Installation

1. Clone the repository to your local machine:
   ```shell
   git clone git@github.com:Paras0750/vidCraft.git
   ```
2. Navigate to backend:
   ```shell
   cd backend
   npm install
   ```
3. Fill up environment variable (.env):
   ```shell
   cp .env.example .env
   ```
4. Start Backend:
   ```shell
   npm run dev
   ```
5. Open 2nd terminal, Start Frontend:
   ```shell
   cd vidcraft/
   npm install
   npm run dev
   ```
