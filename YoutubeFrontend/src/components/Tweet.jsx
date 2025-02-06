import React, { useEffect, useState, useRef } from "react";
import tweetService from "../Backend/tweet.config.js";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

function TweetList() {
  const { userName, userId } = useParams();
  const [tweets, setTweets] = useState([]);
  const [tweetText, setTweetText] = useState("");
  const [editingTweetId, setEditingTweetId] = useState(null);
  const currUserId = useSelector((state) => state?.auth?.userData?._id) || null;
  const inputRef = useRef(null);

  useEffect(() => {
    if (!userName) return;

    tweetService
      .getTweets(userName)
      .then((res) => {
        setTweets(res.data.data[0]);
      })
      .catch((error) => console.error("Error fetching tweets:", error));
  }, [userName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tweetText.trim()) return;

    if (editingTweetId) {
      tweetService
        .upDateTweet(editingTweetId, { newcontent: tweetText })
        .then(() => {
          tweetService
            .getTweets(userName)
            .then((res) => {
              setTweets(res.data.data[0]);
            })
            .catch((error) => console.error("Error fetching tweets:", error));
          setEditingTweetId(null);
          setTweetText("");
        })
        .catch((error) => console.error("Error updating tweet:", error));
    } else {
      tweetService
        .postTweet({ content: tweetText, userName })
        .then(() => {
          tweetService
            .getTweets(userName)
            .then((res) => {
              setTweets(res.data.data[0]);
            })
            .catch((error) => console.error("Error fetching tweets:", error));
          setTweetText("");
        })
        .catch((error) => console.error("Error adding tweet:", error));
    }
  };

  const handleDelete = (tweetId) => {
    tweetService
      .deleteTweet(tweetId)
      .then(() => {
        tweetService
          .getTweets(userName)
          .then((res) => {
            setTweets(res.data.data[0]);
          })
          .catch((error) => console.error("Error fetching tweets:", error));
      })
      .catch((error) => console.error("Error deleting tweet:", error));
  };

  const handleUpdate = (tweetId) => {
    const tweetToEdit = tweets.tweets.find((item) => item._id === tweetId);
    if (!tweetToEdit) return;

    setTweetText(tweetToEdit.content);
    setEditingTweetId(tweetId);

    inputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
        Tweets by <span className="text-red-500">@{userName}</span>
      </h2>
      {userId === currUserId && (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4">
          <input
            type="text"
            ref={inputRef}
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="What's on your mind?"
            required
          />
          <button
            type="submit"
            className="bg-red-600 px-4 py-2 rounded text-white font-semibold hover:bg-red-700"
          >
            {editingTweetId ? "Update" : "Tweet"}
          </button>
        </form>
      )}
      {tweets?.tweets?.length > 0 ? (
        <ul>
          {tweets.tweets.map((tweet) => (
            <li
              key={tweet._id}
              className="p-4 bg-gray-800 rounded-lg shadow mb-4 text-white flex justify-between items-start border border-gray-700"
            >
              <div className="flex items-center">
                <img
                  src={tweets.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full mr-3 border border-gray-600"
                />
                <div>
                  <p className="font-semibold text-blue-400">
                    @{tweets.userName}
                  </p>
                  <span className="text-gray-400 text-sm">
                    {new Date(tweet.createdAt).toLocaleString()}
                  </span>
                  <p className="text-gray-300 mt-2">{tweet.content}</p>
                </div>
              </div>
              {tweet.owner === currUserId && (
                <div className="flex gap-2 text-lg">
                  <button
                    onClick={() => handleUpdate(tweet._id)}
                    className="text-yellow-400 hover:text-yellow-500"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(tweet._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-center">No tweets yet.</p>
      )}
    </div>
  );
}

export default TweetList;
