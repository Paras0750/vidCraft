import React, { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export interface Chapter {
  title: string;
  start: string;
  end: string;
}

export interface Video {
  title: string;
  videoId: string;
  vttFilePath: string;
  videoTranscodePath: {
    "256x144": string;
    "426x240": string;
    "640x360": string;
    "854x480": string;
    "1280x720": string;
  };
  chapters: Chapter[];
  thumbnail: string;
}

export interface APIResponse {
  status: boolean;
  data?: Video[];
}

const VideoCard: React.FC<Video> = ({ videoId, thumbnail, title }) => {
  return (
    <div className="p-4" style={{ color: "#000" }}>
      <div className="bg-white rounded-lg overflow-hidden shadow-md relative ">
        <Link to={`/watch/${videoId}`} className="block w-full h-full">
          <div className="w-[480px] h-[270px] text-center">
            <img
              className="w-full h-full object-cover"
              src={`${
                import.meta.env.VITE_API_STREAM_URL
              }/storage/${thumbnail}`}
              alt={`Thumbnail for ${videoId}`}
            />
          </div>
        </Link>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2 text-center">{title}</h2>
        </div>
      </div>
    </div>
  );
};

export const AllVideos: React.FC = () => {
  const [videos, setVideos] = React.useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        await axios
          .get(`${import.meta.env.VITE_API_STREAM_URL}/api/getFeed`)
          .then((res) => {
            console.log(res.data.data);
            setVideos(res.data.data);
            return res.data;
          });
        console.log("cc", videos);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="container min-w-full p-8 bg-slate-300 min-h-screen">
      <div className="text-2xl font-bold m-5 text-center">ALL Videos</div>
      <div className="flex flex-wrap -mx-4">
        {videos.map((video, index) => (
          <VideoCard key={index} {...video} />
        ))}
      </div>
    </div>
  );
};
