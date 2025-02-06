import React, { useEffect, useState } from "react";
import authservice from "../Backend/auth.config";
import { useParams } from "react-router";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import subscriptionService from "../Backend/subscription.config";
function ChannelPage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    authservice.getChannel(userId).then((res) => {
      setUser(res.data.data);
    });
  }, [userId]);

  const [subscribed, setSubscribed] = useState(false);
  const handleSubscribeClick = () => {
    subscriptionService.toggleSubscription(userId).then(() => {
      setSubscribed(!subscribed);
    });
  };
  const myId = useSelector((state) => state?.auth?.userData?._id) || null;

  useEffect(() => {
    myId
      ? subscriptionService.getChannels(myId).then((res) => {
          res?.data?.data.map((item) => {
            console.log(item);
            if (item.channelData[0]._id === userId) {
              setSubscribed(true);
            }
          });
        })
      : null;
  }, [myId]);

  const navigate = useNavigate();
  return user ? (
    <div className="min-h-screen bg-black text-white">
      {/* Cover Image Section */}
      <div className="relative h-60 w-full lg:h-80">
        {user?.coverImage ? (
          <img
            src={user.coverImage}
            className="h-full  w-full object-cover"
            alt="Cover"
          />
        ) : (
          <div className="w-full mx-auto grid justify-center">
            <img src="/logo.svg" className="mx-auto " />
            <p className="my-10 mx-auto font-bold font-sans">
              User have not any cover image
            </p>
          </div>
        )}
        {/* Avatar */}
        <div className="absolute -bottom-16 left-4 lg:left-8">
          <img
            src={user.avatar}
            className="h-32 w-32 rounded-full border-4 border-black lg:h-40 lg:w-40"
            alt="Avatar"
          />
        </div>
      </div>

      {/* Channel Info Section */}
      <div className="container mx-auto px-4 pt-20 pb-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold lg:text-3xl">{user.fullName}</h1>
            <div className="flex items-center gap-2 text-gray-400">
              <span>@{user.userName}</span>
              <span className="h-1 w-1 rounded-full bg-gray-400"></span>
              <span>{user.subscribersCount} subscribers</span>
            </div>
          </div>

          {!subscribed ? (
            <button
              className="ml-auto px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
              id={userId}
              onClick={handleSubscribeClick}
            >
              Subscribe
            </button>
          ) : (
            <button
              className="ml-auto px-4 py-2 bg-gray-600 rounded-lg"
              id={userId}
              onClick={handleSubscribeClick}
            >
              Subscribed
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 border-b border-gray-800">
          <div className="flex space-x-8">
            <button
              className="  py-4 text-gray-400 hover:text-white"
              onClick={() => {
                navigate(`/channelPage/${userId}/videos`);
              }}
            >
              Videos
            </button>
            <button
              className="py-4 text-gray-400 hover:text-white"
              onClick={() => {
                navigate(`/channelPage/${userId}/playlists`);
              }}
            >
              Playlists
            </button>
            <button
              className="py-4 text-gray-400 hover:text-white"
              onClick={() => {
                navigate(`/channelPage/${userId}/${user.userName}/tweets`);
              }}
            >
              Tweets
            </button>
            <button
              className="py-4 text-gray-400 hover:text-white"
              onClick={() => {
                navigate(`/channelPage/${userId}/subscribers`);
              }}
            >
              Subscribers
            </button>
            <button
              className="py-4 text-gray-400 hover:text-white"
              onClick={() => {
                navigate(`/channelPage/${userId}/subscribedTo`);
              }}
            >
              SubscribedTo
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="py-8">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <p>Loading channel data...</p>
    </div>
  );
}

export default ChannelPage;
