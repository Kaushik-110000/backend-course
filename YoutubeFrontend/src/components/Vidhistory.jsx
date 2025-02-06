import React, { useEffect, useState } from "react";
import videoService from "../Backend/video.config";
import { useNavigate } from "react-router";

function Vidhistory() {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    videoService.getWatchHistory().then((res) => {
      setVideos(res.data.data[0].watchHistory);
    });
  }, []);

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h2 className="text-center text-2xl font-semibold mb-6">Watch History</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div
            key={video._id}
            className=" rounded-lg shadow-lg p-2 w-80 mx-auto"
          >
            <div className="relative" id={video._id}>
              <img
                src={video.thumbNail}
                alt={video.title}
                className="w-full h-38 object-cover rounded-md"
                id={video._id}
                onClick={(e) => {
                  navigate(`/videoPlayer/${e.currentTarget.id}`);
                }}
              />
              <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
                {Math.floor(video.duration / 60)} min{" "}
                {Math.floor(video.duration % 60)} sec
              </div>
            </div>
            <div className="px-0.5 mt-3">
              <h3 className="text-xl font-semibold text-white">
                {video.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{video.views} views</p>
              <div className="flex items-center justify-between mt-2">
                <div
                  className="flex items-center"
                  id={video.owner._id}
                  onClick={(e) => {
                    navigate(`/channelPage/${e.currentTarget.id}/videos`);
                  }}
                >
                  <img
                    src={video.owner.avatar}
                    alt="Owner Avatar"
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <div className="ml-2 text-sm text-white">
                    <p>{video.owner.fullName}</p>
                    <p className="text-gray-400">@{video.owner.userName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Vidhistory;
