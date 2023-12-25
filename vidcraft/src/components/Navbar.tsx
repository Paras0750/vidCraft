import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  // Replace 'John Doe' with the actual user's name

  return (
    <div className="flex justify-between items-center p-4 bg-[#23272d] text-white">
      <div>
        <Link to="/">
          <span className="mx-auto text-2xl font-bold">VidCraft</span>
        </Link>
      </div>

      <div className="flex items-center">
        <Link to="/uploadVideo">
          <button className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl">
            Upload Video
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
