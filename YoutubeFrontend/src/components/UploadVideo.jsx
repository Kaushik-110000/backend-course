import React, { useState } from "react";
import videoService from "../Backend/video.config";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import errorTeller from "../Backend/errorTeller";
function UploadVideo() {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    videoFile: "",
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.auth.userData?._id);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

      if (name === "thumbnail") {
        const previewURL = URL.createObjectURL(file);
        setPreview(previewURL);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmission = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("thumbnail", formData.thumbnail);
    data.append("videoFile", formData.videoFile);

    videoService
      .uploadVideo(data)
      .then(() => {
        alert("Video uploaded successfully!");
        navigate(`/channelPage/${userId}/videos`);
        setFormData({
          title: "",
          description: "",
          thumbnail: "",
          videoFile: "",
        });
        setPreview("");
        setLoading(false);
        navigate(`/channelPage/${userId}/videos`);
      })
      .catch((error) => setError(errorTeller(error)));

    navigate(`/channelPage/${userId}/videos`);
  };

  return (
    <div className="max-w-xl my-10 mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        Upload Your Video
      </h2>
      {error && <p className="text-red-500 text-center mb-2">{error}</p>}

      <form onSubmit={handleSubmission} className="flex flex-col gap-4">
        {/* Video File Upload */}
        <label className="text-white font-semibold">Video File</label>
        <input
          type="file"
          name="videoFile"
          accept="video/*"
          onChange={handleChange}
          className="bg-gray-800 p-2 text-white rounded border border-gray-700"
          // value={formData.videoFile}
          required
        />

        {/* Thumbnail Upload */}
        <label className="text-white font-semibold">Thumbnail</label>
        <input
          type="file"
          name="thumbnail"
          accept="image/*"
          onChange={handleChange}
          className="bg-gray-800 p-2 text-white rounded border border-gray-700"
          // value={formData.thumbnail}
        />
        {preview && (
          <img
            src={preview}
            alt="Thumbnail Preview"
            className="w-full h-40 object-cover rounded-lg border border-gray-700"
          />
        )}

        {/* Title Input */}
        <label className="text-white font-semibold">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="bg-gray-800 p-2 text-white rounded border border-gray-700 focus:ring-2 focus:ring-red-500"
          placeholder="Enter video title"
          required
        />

        {/* Description Input */}
        <label className="text-white font-semibold">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="bg-gray-800 p-2 text-white rounded border border-gray-700 h-24 focus:ring-2 focus:ring-red-500"
          placeholder="Enter video description"
          required
        ></textarea>

        {/* Submit Button */}
        <button
          type="submit"
          className={`bg-red-600 p-3 rounded text-white font-bold hover:bg-red-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
          onClick={() => {
            alert("Your video will be uploaded");
          }}
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
}

export default UploadVideo;
