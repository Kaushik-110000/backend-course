import React, { useEffect, useState } from "react";
import videoService from "../Backend/video.config.js";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

function UserVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const user = useSelector((state) => state?.auth?.userData?._id) || null;
  const navigate = useNavigate();
  useEffect(() => {
    console.log(userId);
    async function fetchVideos() {
      try {
        const res = await videoService.getVideoofUser(userId);
        console.log(res.data.data);
        setVideos(res.data.data); // Directly set the array
      } catch (err) {
        console.error("Failed to fetch videos:", err);
        setError("Failed to load videos.");
      } finally {
        setLoading(false);
      }
    }
    if (userId) fetchVideos();
  }, [userId]);

  const handleEditClick = (e) => {
    // console.log(e.currentTarget.id);
    navigate(`/updateVideo/${e.currentTarget.id}`);
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-black rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        Uploaded Videos
      </h2>

      {/* Loading Indicator */}
      {loading && <p className="text-white text-center">Loading videos...</p>}

      {/* Error Message */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Video List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.length > 0
          ? videos.map((video) => (
              <div key={video._id} className=" p-4 rounded-lg shadow-lg ">
                <div className="relative">
                  <img
                    src={video.thumbNail}
                    alt={video.title}
                    className="w-full h-40 object-cover rounded-lg"
                    onClick={() => {
                      console.log(user, video.owner[0]._id);
                      navigate(`/videoPlayer/${video._id}`);
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
                    {Math.floor(video.duration / 60)} min{" "}
                    {Math.floor(
                      video.duration - Math.floor(video.duration / 60)
                    )}{" "}
                    sec
                  </div>
                </div>

                <div className="flex w-full justify-between items-center h-15">
                  <div>
                    <h3 className="text-lg ml-2 font-bold text-white mt-2">
                      {video.title}
                    </h3>
                    <p className="text-gray-400 ml-2 text-sm">
                      {video.description}
                    </p>
                  </div>
                  {user === video.owner[0]._id ? (
                    <div
                      className="w-5 h-5 flex items-center justify-center"
                      id={video._id}
                      onClick={handleEditClick}
                    >
                      <img
                        src="/edit.svg"
                        className="mr-2"
                        alt="Edit video details"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          : !loading && (
              <p className="text-gray-400 text-center">No videos found.</p>
            )}
      </div>
    </div>
  );
}

export default UserVideos;
