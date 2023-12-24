import { useState, ChangeEvent } from "react";
import axios from "axios";

export const UploadVideo = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, settitle] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    try {
      const formData = new FormData();
      console.log(file);

      formData.append("video", file);
      formData.append("title", title);

      console.log(formData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_STREAM_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Data: ", response.data);
      alert("File uploaded successfully!");
    } catch (error: Error | any) {
      console.error("Error uploading file:", error.message);
      alert("Error uploading file. Please try again.");
    }
  };

  return (
    <div className="h-screen pt-40 bg-slate-300">
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md w-full ">
        <h2 className="text-2xl font-semibold mb-4">File Upload</h2>
        <div className="flex flex-col">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="my-4"
          />
          <input
            type="text"
            placeholder="Enter Title For Video"
            value={title}
            onChange={(e) => settitle(e.target.value)}
            className="my-4 p-2 border-2 border-gray-300 rounded outline-none"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadVideo;
