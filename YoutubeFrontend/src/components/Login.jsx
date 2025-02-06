import React, { useEffect, useState } from "react";
import Input from "./Input";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login as storeLogin } from "../store/authSlice.js";
import authservice from "../Backend/auth.config.js";
import errorTeller from "../Backend/errorTeller.js";
function Login() {
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const formData = { userName, email, password };
      await authservice.login(formData);
      console.log(formData);
      authservice.getCurrentUser().then((res) => {
        const user = res;
        dispatch(storeLogin({ userData: user }));
        if (user) {
          setUserName("");
          setEmail("");
          setPassword("");
          navigate("/allVideos");
        }
      });
    } catch (error) {
      setError(errorTeller(error));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Login
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don't have an account?&nbsp;
          <Link
            to="/register"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Create
          </Link>
        </p>
        {error && (
          <div className="bg-red-700 text-red-200 text-center p-2 rounded mb-4">
            {error}
          </div>
        )}
        <p className="mx-0.5 text-center text-blue-400 ">
          Enter either username or email
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username */}
          <Input
            label="Username"
            name="userName"
            placeholder="Enter your username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="bg-gray-700 text-white"
          />

          {/* Email */}
          <Input
            type="email"
            label="Email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-700 text-white"
          />

          {/* Password */}
          <Input
            required
            type="password"
            label="Password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-700 text-white"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
export default Login;
