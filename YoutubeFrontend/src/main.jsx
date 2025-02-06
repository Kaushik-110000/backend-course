import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./store/store.js";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router";
import Home from "./pages/Home.jsx";
import {
  ChangePassword,
  ChannelList,
  Login,
  PlaylistList,
  Register,
  SubscribersList,
  TweetList,
  UpdateVideo,
  UploadVideo,
  UserUpdate,
  UserVideos,
  VideosInPlaylist,
  Vidhistory,
} from "./components/index.js";
import AllVideos from "./pages/AllVideos.jsx";
import VideoPlayer from "./pages/VideoPlayer.jsx";
import ChannelPage from "./pages/ChannelPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/changePassword",
        element: <ChangePassword />,
      },
      {
        path: "/updateDetails",
        element: <UserUpdate />,
      },
      {
        path: "/allVideos",
        element: <AllVideos />,
      },
      {
        path: "/videoPlayer/:videoId",
        element: <VideoPlayer />,
      },
      {
        path: "/uploadVideo",
        element: <UploadVideo />,
      },
      {
        path: "/updateVideo/:videoId",
        element: <UpdateVideo />,
      },
      {
        path: "/channelPage/:userId",
        element: <ChannelPage />,
        children: [
          {
            path: "/channelPage/:userId/videos",
            element: <UserVideos />,
          },
          {
            path: "/channelPage/:userId/playlists",
            element: <PlaylistList />,
          },
          {
            path: "/channelPage/:userId/playlists/:playlistId",
            element: <VideosInPlaylist />,
          },
          {
            path: "/channelPage/:userId/:userName/tweets",
            element: <TweetList />,
          },
          {
            path: "/channelPage/:userId/subscribers",
            element: <SubscribersList />,
          },
          {
            path: "/channelPage/:userId/subscribedTo",
            element: <ChannelList />,
          },
        ],
      },
      {
        path: "/watchHistory",
        element: <Vidhistory />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
