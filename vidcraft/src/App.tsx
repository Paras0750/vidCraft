import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UploadVideo } from "./components/UploadVideo/UploadVideo";
import { AllVideos } from "./components/AllVideos/AllVideos";
import { WatchVideo } from "./components/WatchVideo/WatchVideo";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Router>
        <Navbar />
        <Routes>
        <Route path="/" Component={ AllVideos } />
        <Route path="/uploadVideo" Component={UploadVideo} />
        <Route path="/watch/:videoId" Component={WatchVideo} />
      </Routes>
    </Router>
  );
};

export default App;
