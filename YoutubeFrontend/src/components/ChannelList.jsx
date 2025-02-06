import React, { useState, useEffect } from "react";
import subscriptionService from "../Backend/subscription.config";
import { useNavigate, useParams } from "react-router";

function ChannelList() {
  const { userId } = useParams();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userId) return;

    subscriptionService
      .getChannels(userId)
      .then((res) => {
        if (res.data && res.data.data) {
          setChannels(res.data.data.map((item) => item.channelData[0]));
        }
      })
      .then(() => {
        console.log(channels);
      })
      .catch((error) => console.error("Error fetching channels:", error))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChannelCLick = (e) => {
    navigate(`/channelPage/${e.currentTarget.id}/videos`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        Subscribed Channels
      </h2>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-800 h-24 rounded-lg"
            ></div>
          ))}
        </div>
      ) : channels?.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {channels.map((channel) => (
            <div
              key={channel._id}
              className="bg-gray-800 rounded-lg shadow-md p-4 text-center transform hover:scale-105 transition"
              id={channel._id}
              onClick={handleChannelCLick}
            >
              <img
                src={channel.avatar}
                alt={channel.name}
                className="w-16 h-16 rounded-full mx-auto border border-gray-600"
              />
              <h3 className="text-white font-semibold mt-2">
                {channel.fullName}
              </h3>
              <p className="text-white font-semibold mt-2">
                @{channel.userName}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center">No subscriptions yet.</p>
      )}
    </div>
  );
}

export default ChannelList;
