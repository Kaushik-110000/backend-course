import React, { useEffect, useState } from "react";
import Popup from "./Popup";
import { useDispatch, useSelector } from "react-redux";
import { popOut } from "../store/playlistSlice";
import playlistService from "../Backend/playlist.config";
import authservice from "../Backend/auth.config.js";
import errorTeller from "../Backend/errorTeller.js";

function PlaylistPopup({ isOpen, theVideoId = null }) {
  const dispatch = useDispatch();
  const [playlists, setPlaylists] = useState([]);
  const videoId =
    useSelector((state) => state?.playlistPop?.videoId) || theVideoId;
  const [error, setError] = useState("");
  const addToPlaylist = (e) => {
    try {
      console.log(e.currentTarget.id);
      const playlistId = e.currentTarget.id;
      playlistService.addToPlaylist(videoId, playlistId).then(() => {
        console.log(playlistId, videoId);
        dispatch(popOut());
      });
    } catch (error) {
      setError(errorTeller(error));
    }
  };

  useEffect(() => {
    authservice.getCurrentUser().then((res) => {
      playlistService.getUserPlaylists(res._id).then((res) => {
        setPlaylists(res.data.data);
      });
    });
  }, []);

  const [newPlaylist, setNewPlayList] = useState("");
  const [desc, setDesc] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    try {
      if (newPlaylist != "") {
        playlistService
          .postPlaylist({ name: newPlaylist, description: desc })
          .then((res) => {
            setNewPlayList("");
            setDesc("");
            setError("");
            setPlaylists([...playlists, res.data.data]);
          })
          .catch((error) => setError("Fill both properly"));
      }
    } catch (error) {
      setError(errorTeller(error));
    }
  };

  return (
    <Popup isOpen={isOpen} onClose={() => dispatch(popOut())}>
      <div className="p-6 text-white rounded-lg shadow-xl w-70">
        {/* Header */}
        <h2 className="text-lg font-semibold text-center mb-4">
          Choose Playlist
        </h2>

        {error && (
          <div className="bg-red-700 text-red-200 text-center p-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Playlists */}
        <div className="scrollable-element max-h-60 overflow-y-auto space-y-3">
          {playlists.length > 0 ? (
            playlists.map((item) => (
              <button
                key={item._id}
                id={item._id}
                className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 shadow-sm"
                onClick={addToPlaylist}
              >
                {item.name}
              </button>
            ))
          ) : (
            <p className="text-center text-gray-400">No playlists available</p>
          )}
        </div>
        <div className="mt-4">
          <form
            className="grid items-center justify-center space-x-2"
            onSubmit={handleFormSubmit}
          >
            {/* Input Box */}
            <input
              required
              type="text"
              label="new"
              placeholder="Add new"
              value={newPlaylist}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg  bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                setNewPlayList(e.target.value);
              }}
            />

            <input
              required
              type="text"
              label="description"
              placeholder="description"
              value={desc}
              className="w-full px-4 py-2 border mt-1 border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                setDesc(e.target.value);
              }}
            />

            {/* Add Button */}
            <button
              type="submit"
              className="px-4 py-2 w-30 mx-auto mt-1  bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-200 shadow-md"
            >
              Add
            </button>
          </form>
        </div>
        {/* Close Button */}
        <div className="text-center mt-5">
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-all duration-200 text-white shadow-md"
            onClick={() => dispatch(popOut())}
          >
            Close
          </button>
        </div>
      </div>
    </Popup>
  );
}
export default PlaylistPopup;
