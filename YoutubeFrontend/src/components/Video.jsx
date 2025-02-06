import React, { useState, useEffect, useRef } from "react";
import PlaylistPopup from "./PlaylistPopup";
import { useDispatch, useSelector } from "react-redux";
import { popin as storePopIn } from "../store/playlistSlice.js";
import { useNavigate } from "react-router";
function Video({ vid }) {
  const dispatch = useDispatch();
  const [dotsClicked, setDotsClicked] = useState(false);
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const handleVideoClick = (e) => {
    console.log(e.currentTarget.id);
    if (!authStatus) navigate("/");
    else navigate(`/videoPlayer/${e.currentTarget.id}`);
  };

  const handleChannelClick = (e) => {
    // console.log(e.currentTarget.id);
    navigate(`/channelPage/${e.currentTarget.id}/videos`);
  };

  const dotsMenuRef = useRef(null);
  const handleDotsClick = (e) => {
    e.stopPropagation();
    setDotsClicked(!dotsClicked);
    // console.log(e.currentTarget.id);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dotsMenuRef.current && !dotsMenuRef.current.contains(e.target)) {
        setDotsClicked(false); // Close the menu if click is outside the dots menu
      }
    };

    // Add event listener for clicks outside the menu
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePlaylistClick = (e) => {
    console.log(e.currentTarget.id);
    dispatch(storePopIn({ videoId: e.currentTarget.id }));
    setDotsClicked(false);
  };

  return (
    <div className="my-4 w-80 mx-auto rounded-lg shadow-md pl-1">
      <div
        className="relative"
        id={vid._id}
        onClick={handleVideoClick}
        key={`${vid.id}-image`}
      >
        {/* Video Thumbnail */}
        <img
          src={vid.thumbNail}
          className="w-full h-48 object-cover"
          alt="Video Thumbnail"
        />
        {/* Video duration */}
        <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
          {Math.floor(vid.duration / 60)} min{" "}
          {Math.floor(vid.duration - Math.floor(vid.duration / 60))} sec
        </div>
      </div>

      {/* Video Details */}
      <div className="px-4">
        {/* Views */}
        <div className="text-xs text-gray-500 mt-3">
          <p>{vid.views} views</p>
        </div>
        <h3 className="text-xl font-semibold text-white">{vid.title}</h3>

        {/* Owner info */}
        {vid.owner && vid.owner.length > 0 && (
          <div className=" items-center justify-between flex mt-2 ">
            <div
              className=" items-center flex"
              id={vid?.owner[0]._id}
              key={`${vid?.owner[0]._id}-owner`}
              onClick={handleChannelClick}
            >
              <img
                src={vid.owner[0].avatar}
                alt="Owner Avatar"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <div className="ml-2 text-sm text-white">
                <p>{vid.owner[0].fullName}</p>
                <p className="text-gray-400">@{vid.owner[0].userName}</p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/tripleDot.svg"
                id={vid._id}
                key={`${vid.id}-dots`}
                onClick={handleDotsClick}
              />
              {dotsClicked ? (
                <ul
                  ref={dotsMenuRef}
                  className="absolute top-6 right-0 bg-black border-1 border-white shadow-lg rounded-md z-50 w-32"
                >
                  <li
                    className="px-3 py-2 hover:bg-amber-50 cursor-pointer"
                    id={vid._id}
                    key={`${vid.id}-addPlaylist`}
                    onClick={handlePlaylistClick}
                  >
                    Add to Playlist
                  </li>
                </ul>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Video;
