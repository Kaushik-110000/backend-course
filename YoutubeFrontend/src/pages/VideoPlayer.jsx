import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Use useNavigate instead of Navigate
import videoService from "../Backend/video.config";
import AllVideos from "./AllVideos";
import likeService from "../Backend/like.config";
import CommentsList from "../components/CommentsList";
import subscriptionService from "../Backend/subscription.config";
import { useSelector } from "react-redux";
function VideoPlayer() {
  const { videoId } = useParams();
  const [vid, setVid] = useState(null);
  const navigate = useNavigate(); // Use useNavigate for programmatic navigation
  const [liked, setLiked] = useState([]);
  const userId = useSelector((state) => state?.auth?.userData?._id) || null;
  const user = useSelector((state) => state?.auth?.userData) || null;
  useEffect(() => {
    videoService
      .findVideo(videoId)
      .then((res) => {
        if (res) {
          setVid(res.data.data[0]); // Set the video data
        } else {
          throw new Error("Video not found"); // Throw an error if res is falsy
        }
      })
      .catch((error) => {
        console.error(error);
        navigate("/allVideos"); // Use navigate to redirec
      });
  }, [videoId, navigate]); // Add videoId and navigate as dependencies

  useEffect(() => {
    if (!vid) return;
    likeService
      .likedVideos()
      .then((re) => {
        const isLiked = re?.data?.data.some(
          (likedVid) => likedVid?.video[0]._id === vid?._id
        );
        setLiked(isLiked);
      })
      .catch((error) => {
        setLiked(false);
      });
  }, [vid]);

  const handleOwnerClick = (e) => {
    // console.log(e.currentTarget.id);
    navigate(`/channelPage/${e.currentTarget.id}/videos`);
  };

  const [subscribed, setSubscribed] = useState(false);
  const handleSubscribeClick = () => {
    subscriptionService.toggleSubscription(vid.owner[0]._id).then(() => {
      setSubscribed(!subscribed);
    });
  };

  useEffect(() => {
    userId
      ? subscriptionService.getChannels(userId).then((res) => {
          res?.data?.data.map((item) => {
            if (item.channelData[0]._id === vid?.owner[0]?._id) {
              setSubscribed(true);
            }
          });
        })
      : null;
  }, [userId, vid]);

  const handleLikeClick = () => {
    likeService.toggleLike(videoId).then(() => {
      setLiked(!liked);
    });
  };

  return (
    <>
      {vid ? (
        <div className="relative bg-black text-white min-h-screen p-4 flex flex-col md:flex-row">
          {/* Left Side (Video and Info) */}
          <div className="w-full md:w-2/4 lg:w-2/3">
            <h1 className="text-xl font-bold mb-2">{vid.title}</h1>
            <video
              controls
              disablePictureInPicture
              controlsList="nodownload"
              src={vid.videoFile}
              className="w-full rounded-lg"
              autoPlay
            />
            <p className="mt-2 text-gray-300">{vid.description}</p>

            {/* Like Section */}
            <div className="w-full flex flex-nowrap justify-between px-2">
              <div className="flex items-center gap-4 mt-4">
                <button
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
                  onClick={handleLikeClick}
                >
                  👍{!liked ? "Like" : "Liked"}
                </button>
              </div>
            </div>

            {/* Channel Info */}
            <div className="flex items-center mt-6 p-2 bg-gray-900 rounded-lg">
              <img
                src={vid.owner[0].avatar}
                alt={vid.owner[0].userName}
                className="w-12 h-12 rounded-full"
                id={vid.owner[0]._id}
                onClick={handleOwnerClick}
              />
              <div
                className="ml-3"
                id={vid.owner[0]._id}
                onClick={handleOwnerClick}
              >
                <h2 className="text-lg font-semibold">
                  {vid.owner[0].fullName}
                </h2>
                <p className="text-gray-400">@{vid.owner[0].userName}</p>
              </div>
              {!subscribed ? (
                <button
                  className="ml-auto px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                  id={vid.owner[0]._id}
                  onClick={handleSubscribeClick}
                >
                  Subscribe
                </button>
              ) : (
                <button
                  className="ml-auto px-4 py-2 bg-gray-600 rounded-lg"
                  id={vid.owner[0]._id}
                  onClick={handleSubscribeClick}
                >
                  Subscribed
                </button>
              )}
            </div>

            {/* Comments Section */}
            <div className="mt-6 p-4 bg-gray-900 rounded-lg ">
              Comments
              <CommentsList videoId={videoId} />
            </div>
          </div>

          {/* Right Side (More Videos) */}
          <div className="w-full md:w-2/4 lg:w-1/3 p-2 mt-4 md:mt-0">
            <div className="p-4  rounded-lg grid justify-center items-center">
              <div className="mx-auto">More Videos</div>
              <AllVideos />
            </div>
          </div>
        </div>
      ) : (
        <p>Loading video...</p>
      )}
    </>
  );
}

export default VideoPlayer;
