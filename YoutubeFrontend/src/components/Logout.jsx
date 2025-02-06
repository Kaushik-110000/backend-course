import React, { useEffect, useState } from "react";
import Input from "./Input";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login as storeLogin } from "../store/authSlice.js";
import authservice from "../Backend/auth.config.js";

function Logout({ ...at }) {
  return (
    <div className="mt-4" {...at}>
      <p className="text-white text-sm">
        Logout
      </p>
    </div>
  );
}

export default Logout;
