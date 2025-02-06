import React, { useState } from "react";
import Input from "./Input";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login as storeLogin } from "../store/authSlice.js";
import authservice from "../Backend/auth.config.js";
import errorTeller from "../Backend/errorTeller.js";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    avatar: null,
    coverImage: null,
    password: "",
  });

  const [buttonData, setButtonData] = useState("Register");

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setButtonData("Wait...");

    try {
      const data = new FormData();
      console.log(formData.fullName);
      data.append("fullName", formData.fullName);
      data.append("userName", formData.userName);
      data.append("email", formData.email);
      data.append("password", formData.password);
      if (formData.avatar) data.append("avatar", formData.avatar);
      if (formData.coverImage) data.append("coverImage", formData.coverImage);
      console.log(data);

      const user = await authservice.createAccount(data);
      if (user) {
        alert("You can now login");
        navigate("/login");
      }
    } catch (error) {
      setButtonData("Register");
      setError(errorTeller(error));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black ">
      <div className="w-full max-w-md bg-gray-900 text-white rounded-2xl shadow-xl p-8 mt-5 mb-5">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Create Account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {/* Display error message if any */}
        {error && <div className="text-red-400 text-center mb-4">{error}</div>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Full Name */}
          <Input
            required
            label="Full Name"
            name="fullName"
            placeholder="Enter your full name"
            onChange={handleChange}
            value={formData.fullName}
          />

          {/* User Name */}
          <Input
            required
            label="Username"
            name="userName"
            placeholder="Enter unique username"
            onChange={handleChange}
            value={formData.userName}
          />

          {/* Email */}
          <Input
            required
            type="email"
            label="Email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            value={formData.email}
          />

          {/* Avatar */}
          <Input
            required
            type="file"
            label="Avatar"
            name="avatar"
            onChange={handleChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gray-600 file:text-gray-300 hover:file:bg-gray-500"
          />

          {/* Cover Image */}
          <Input
            required
            type="file"
            label="Cover Image"
            name="coverImage"
            onChange={handleChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gray-600 file:text-gray-300 hover:file:bg-gray-500"
          />

          {/* Password */}
          <Input
            required
            type="password"
            label="Password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            value={formData.password}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition duration-200"
          >
            {buttonData}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
