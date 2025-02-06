import React from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
function Home() {
  const navigate = useNavigate();
  const loginStatus = useSelector((state) => state?.auth?.status);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-7xl font-bold mb-1">Welcome to</h1>
        <img src="/logo.svg" alt="Logo" className="w-90 h-40 mx-auto mb-7" />
        <button
          onClick={() => {
            if (loginStatus) navigate("/allVideos");
            else navigate("/register");
          }}
          className="bg-black border hover:scale-120 border-white text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
        >
          Go to Videos Section
        </button>
      </div>
    </div>
  );
}

export default Home;
