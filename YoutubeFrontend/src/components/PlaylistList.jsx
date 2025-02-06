import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import playlistService from "../Backend/playlist.config";
import { useNavigate, useParams } from "react-router";

function PlaylistList() {
  const { userId } = useParams();
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();
  // Get the logged-in user ID from Redux
  const user = useSelector((state) => state?.auth?.userData?._id) || null;
  const [bool, setBool] = useState(true);

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const res = await playlistService.getUserPlaylists(userId);
        setPlaylists(res.data.data);
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      }
    }
    if (userId) fetchPlaylists();
  }, [userId, bool]);

  const handlePlaylistClick = (e) => {
    console.log(e.currentTarget.id);
    navigate(`/channelPage/${userId}/playlists/${e.currentTarget.id}`);
  };

  const handleDelete = async (e) => {
    console.log(e.currentTarget.id);
    const Pid = e.currentTarget.id;
    playlistService.deletePlaylist(Pid).then(() => setBool(!bool));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        Your Playlists
      </h2>

      {playlists.length === 0 ? (
        <p className="text-gray-400 text-center">No playlists found.</p>
      ) : (
        <div className="space-y-4">
          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              className="flex justify-between items-center bg-gray-900 p-4 rounded-lg shadow"
            >
              {/* Playlist Details */}
              <div id={playlist._id} onClick={handlePlaylistClick}>
                <h3 className="text-lg font-bold text-white">
                  {playlist.name}
                </h3>
                <p className="text-gray-400 text-sm">{playlist.description}</p>
                <p className="text-gray-500 text-xs">
                  Created: {new Date(playlist.createdAt).toLocaleDateString()}
                </p>
              </div>
              {user === playlist.owner && (
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                  onClick={handleDelete}
                  id={playlist._id}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlaylistList;
