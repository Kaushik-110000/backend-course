import React, { useEffect, useState } from "react";
import playlistService from "../Backend/playlist.config";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";

function VideosInPlaylist() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    playlistService
      .getPlaylistVideos(playlistId)
      .then((res) => {
        setPlaylist(res.data.data[0]);
        console.log(res.data.data[0]);
        setVideos(res.data.data[0].videos);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [playlistId]);

  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  if (!playlist) {
    return (
      <div className="text-white text-center mt-10">No playlist found.</div>
    );
  }

  const handleDelete = async (e) => {
    console.log(e.currentTarget.id);
    const ID = e.currentTarget.id;
    playlistService.deletePlaylistVideo(playlistId, ID).then(() => {
      setVideos((videos) => {
        return videos.filter((item) => {
          return item._id !== ID;
        });
      });
    });
  };

  return (
    <div className="bg-black min-h-screen p-6 text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold">{playlist.name}</h1>
        <p className="text-gray-400 mt-3">{playlist.description}</p>
        <div className="flex items-center justify-center mt-4">
          <img
            src={playlist.owner.avatar}
            alt="Owner Avatar"
            className="w-10 h-10 rounded-full mr-2"
          />
          <span className="text-gray-300">
            {playlist.owner.fullName} (@{playlist.owner.userName})
          </span>
        </div>
      </motion.div>

      <div className="flex flex-wrap justify-center">
        {videos?.map((video) => (
          <motion.div
            key={video._id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className=" p-5 rounded-lg shadow-lg relative flex flex-col"
          >
            <div className="mx-auto bg-gray-700 p-5 w-50 rounded-2xl">
              <img
                id={video._id}
                src={video.thumbNail}
                alt={video.name}
                className="w-full h-35 object-cover rounded-md"
                onClick={(e) => {
                  navigate(`/videoPlayer/${e.currentTarget.id}`);
                }}
              />
              <div className="flex justify-between items-start mt-3">
                <div>
                  <h2 className="text-lg font-semibold">{video.title}</h2>
                  <p className="text-gray-400 text-sm">{video.description}</p>
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={handleDelete}
                  id={video._id}
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default VideosInPlaylist;
