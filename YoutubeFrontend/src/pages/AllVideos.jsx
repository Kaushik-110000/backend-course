import React, { useEffect, useState } from "react";
import videoService from "../Backend/video.config";
import Video from "../components/Video";
import { useDispatch, useSelector } from "react-redux";
import PlaylistPopup from "../components/PlaylistPopup";
import { popOut } from "../store/playlistSlice";
function AllVideos() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const authStatus = useSelector((state) => state.auth.status);
  const isOpen = useSelector((state) => state.playlistPop.status);

  useEffect(() => {
    videoService.getAllVideos(page, limit).then((res) => {
      setVideos(res.data.data);
      console.log(res.data.data);
      if (res.data.data.length == 0) setPage(1);
    });
    window.scrollTo(0, 0);
  }, [page]);

  const handleNextClick = () => {
    setPage(page + 1);
  };
  const handlePrevClick = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <div className="scrollable-element w-full h-full grid justify-center ">
      <PlaylistPopup isOpen={isOpen} />
      <div className="flex w-full flex-wrap mx-auto">
        {videos.map((item) => {
          return <Video vid={item} key={item._id} />;
        })}
      </div>

      <div className="w-full  flex justify-center">
        <button
          className="bg-red-700 m-3 w-20 h-8 rounded-lg"
          onClick={handlePrevClick}
          key="PrevKey"
        >
          PREV
        </button>
        <button
          className="bg-red-700 m-3 w-20 h-8 rounded-lg"
          onClick={handleNextClick}
          key="NextKey"
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
export default AllVideos;
