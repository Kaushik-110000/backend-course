import React, { useState, useRef } from "react";
import Input from "./Input";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login as storeLogin } from "../store/authSlice.js";
import errorTeller from "../Backend/errorTeller.js"
import authservice from "../Backend/auth.config.js";

const UserUpdate = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmitForm1 = async (e) => {
    e.preventDefault();
    const data = { fullName, email };
    try {
      const res = await authservice.updateDetails(data);
      console.log(res.data.message);
      setFullName("");
      setEmail("");
      alert("Details updated");
      navigate("/allVideos");
    } catch (error) {
      setError(errorTeller(error));
    }
  };
  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { avatar };
      console.log("your avatar is ", avatar);
      const res = await authservice.updateAvatar(data);
      setAvatar(null);
      if (res) {
        alert("Avatar updated");
        navigate("/allVideos");
      }
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    } catch (error) {
      setError(errorTeller(error));
    }
  };

  const handleCoverImageSubmit = (e) => {
    e.preventDefault();
    try {
      const data = { coverImage };
      authservice
        .updateCoverImage(data)
        .then(() => {
          setCoverImage(null);
          alert("Cover Image updated");
          navigate("/allVideos");
          if (coverInputRef.current) {
            coverInputRef.current.value = "";
          }
        })
        .catch((error) => setError(errorTeller(error)));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10">
      <h2 className="text-3xl font-semibold mb-8">Update Your Details</h2>
      {error && <p className="text-red-500 text-center mb-2">{error}</p>}

      {/* Update Full Name & Email */}
      <form
        onSubmit={handleSubmitForm1}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mb-6"
      >
        <h3 className="text-xl mb-4">Update Name & Email</h3>
        <Input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-md"
        >
          Update Details
        </button>
      </form>

      {/* Update Avatar */}
      <form
        onSubmit={handleAvatarSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mb-6"
      >
        <h3 className="text-xl mb-4">Update Avatar</h3>
        <Input
          type="file"
          name="avatar"
          onChange={(e) => setAvatar(e.target.files[0])}
          ref={avatarInputRef}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-md"
        >
          Update Avatar
        </button>
      </form>

      {/* Update Cover Image */}
      <form
        onSubmit={handleCoverImageSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h3 className="text-xl mb-4">Update Cover Image</h3>
        <Input
          type="file"
          name="coverImage"
          onChange={(e) => setCoverImage(e.target.files[0])}
          ref={coverInputRef}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-md"
        >
          Update Cover Image
        </button>
      </form>
    </div>
  );
};

export default UserUpdate;
