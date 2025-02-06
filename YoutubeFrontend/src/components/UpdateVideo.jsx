import React, { useState, useEffect } from "react";
import videoService from "../Backend/video.config";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
function UpdateVideo() {
  const { videoId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: null,
  });
  const userId = useSelector((state) => state?.auth?.userData?._id);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const navigate = useNavigate();

  // Fetch existing video data
  useEffect(() => {
    async function fetchVideoDetails() {
      try {
        const res = await videoService.findVideo(videoId);
        console.log(res.data.data[0]);
        const response = res.data.data[0];
        setFormData({
          title: response.title,
          description: response.description,
          thumbnail: response.thumbNail, // Existing thumbnail
        });
        setPreview(response.thumbNail);
        setIsPublished(response.isPublished);
      } catch (error) {
        console.error("Failed to fetch video details:", error);
        setError("Failed to load video details.");
      }
    }
    fetchVideoDetails();
  }, [videoId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

      if (name === "thumbnail") {
        if (preview) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(file)); // Live preview
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.thumbnail instanceof File) {
      data.append("thumbnail", formData.thumbnail);
    }

    try {
      await videoService.updateVideo(videoId, data);
      alert("✅ Video updated successfully!");
      navigate(`/channelPage/${userId}/videos`);
    } catch (error) {
      console.error("Update error:", error);
      setError("❌ Failed to update video. Please try again.");
    }
    setLoading(false);
  };

  // Toggle Publish Status
  const handleTogglePublish = async () => {
    try {
      await videoService.togglePublish(videoId);
      setIsPublished((prev) => !prev); // Toggle state
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
      setError("Could not update publish status.");
    }
  };

  // Handle Video Deletion
  const handleDeleteVideo = async () => {
    const confirmDelete = window.confirm(
      "⚠️ Are you sure you want to delete this video? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await videoService.deleteVideo(videoId);
      alert("🗑️ Video deleted successfully!");
      navigate(`/channelPage/${userId}/videos`);
    } catch (error) {
      console.error("Failed to delete video:", error);
      setError("❌ Failed to delete video. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-black rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        Update Video
      </h2>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <form onSubmit={handleSubmission} className="flex flex-col gap-4">
        {/* Thumbnail Upload */}
        <label className="text-white font-semibold">Thumbnail</label>
        <input
          type="file"
          name="thumbnail"
          accept="image/*"
          onChange={handleChange}
          className="bg-gray-800 p-2 text-white rounded border border-gray-700"
          required
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
        >
          {loading ? "Updating..." : "Update Video"}
        </button>

        {/* Publish Toggle Button */}
        <button
          type="button"
          onClick={handleTogglePublish}
          className={`p-3 rounded text-white font-bold transition ${
            isPublished
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          {isPublished ? "Published ✅" : "Not Published ❌"}
        </button>

        {/* Delete Video Button */}
        <button
          type="button"
          onClick={handleDeleteVideo}
          className="p-3 rounded text-white font-bold bg-red-800 hover:bg-red-900 transition"
        >
          🗑️ Delete Video
        </button>
      </form>
    </div>
  );
}

export default UpdateVideo;
