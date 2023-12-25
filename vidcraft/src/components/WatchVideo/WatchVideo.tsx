import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import { Chapter, Video } from "../AllVideos/AllVideos";

export const WatchVideo = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [videoURL, setvideoURL] = useState<string>(
    `${
      import.meta.env.VITE_API_STREAM_URL
    }/uploadedVideos/${videoId}-426x240.mp4`
  );
  const [videoData, setVideoData] = useState<Video>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const selectRef = useRef<HTMLSelectElement>(null);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_STREAM_URL}/api/getVideo/${videoId}`
        );
        const videoData = response.data.data[0];

        console.log("videoData: ", videoData);
        setVideoData(videoData);
        setChapters(videoData.chapters);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchVideo();
  }, [videoId]);

  const handleVideoURL = (): void => {
    const selected = selectRef.current?.value;
    const urlPrefix = `${import.meta.env.VITE_API_STREAM_URL}/uploadedVideos/`;

    switch (selected) {
      case "256x144":
        setvideoURL(`${urlPrefix}${videoId}-256x144.mp4`);
        console.log("Set Quality: ", videoURL);
        break;
      case "426x240":
        setvideoURL(`${urlPrefix}${videoId}-426x240.mp4`);
        console.log("Set Quality: ", videoURL);
        break;
      case "640x360":
        setvideoURL(`${urlPrefix}${videoId}-640x360.mp4`);
        console.log("Set Quality: ", videoURL);
        break;
      case "854x480":
        setvideoURL(`${urlPrefix}${videoId}-854x480.mp4`);
        console.log("Set Quality: ", videoURL);
        break;
      case "1280x720":
        setvideoURL(`${urlPrefix}${videoId}-1280x720.mp4`);
        console.log("Set Quality: ", videoURL);
        break;
      case "1920x1080":
        setvideoURL(`${urlPrefix}${videoId}-1920x1080.mp4`);
        console.log("Set Quality: ", videoURL);
        break;
      default:
        setvideoURL(`${urlPrefix}${videoId}-1280x720.mp4`);
        console.log("Set Quality: ", videoURL);
        break;
    }
  };

  const handleChapterChange = (start: string) => {
    if (start) {
      const [hours, minutes, seconds] = start.split(":").map(parseFloat);
      const startTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
      playerRef.current?.seekTo(startTimeInSeconds);
    }
  };

  return (
    <div>
      <div className="text-center font-bold text-3xl mt-5 mb-12">
        {videoData?.title}
      </div>
      <div className="flex gap-10">
        <div className="mt-4 mx-3 p-2 bg-gray-50 border rounded w-[20%]">
          <h2 className="text-2xl font-bold mb-6 text-center">Chapters</h2>
          <hr />
          <div>
            {chapters.map((chapter) => (
              <div
                key={chapter.title}
                onClick={() => handleChapterChange(chapter.start)}
                className="hover:bg-slate-300 p-1 rounded"
              >
                <p className="font-bold text-xl my-2 ">{chapter.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative rounded-full w-[70%] h-[40%]">
          <ReactPlayer
            ref={playerRef}
            className="video-player aspect-video rounded-3xl"
            url={videoURL}
            playing={true}
            controls={true}
            height={"30%"}
            width={"100%"}
            config={{
              file: {
                attributes: {
                  crossOrigin: "true",
                },
                tracks: [
                  {
                    kind: "subtitles",
                    src: `${
                      import.meta.env.VITE_API_STREAM_URL
                    }/storage/${videoId}-subtitle.vtt`,
                    srcLang: "en",
                    label: "English",
                    default: true,
                  },
                ],
              },
            }}
          />
          <select
            ref={selectRef}
            onChange={handleVideoURL}
            defaultValue={"426x240"}
            className="absolute top-[10px] right-[30px] mt-4 ml-6 p-2 bg-white border rounded"
          >
            <option value="256x144">144p</option>
            <option value="426x240">240p</option>
            <option value="640x360">360p</option>
            <option value="854x480">480p</option>
            <option value="1280x720">720p</option>
            <option value="1920x1080">1080p</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default WatchVideo;
