import React, { useEffect, useState } from "react";
import Input from "./Input";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logOut as storeLogout } from "../store/authSlice.js";
import authservice from "../Backend/auth.config.js";
import errorTeller from "../Backend/errorTeller.js";

function ChangePassword() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (confPassword !== newPassword) {
      setError("Both confirm password and new password must be same ");
      return;
    }

    try {
      const formData = { oldPassword, newPassword };
      authservice
        .changePassword(formData)
        .then((res) => {
          if (res) {
            setSuccess(res.message);
            authservice
              .getCurrentUser()
              .then((user) => {
                if (user) {
                  alert("Password Changed");
                  dispatch(storeLogout());
                  navigate("/login");
                }
              })
              .catch((error) => {
                setError(errorTeller(error));
              });
          }
        })
        .catch((error) => {
          setError(errorTeller(error));
        });
    } catch (error) {
      console.log("Request Error:", error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Change Password
        </h2>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-2">{success}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-gray-300 block mb-1">Old Password</label>
            <input
              required
              type="password"
              name="oldPassword"
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-1">New Password</label>
            <input
              required
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-1">Confirm Password</label>
            <input
              required
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
