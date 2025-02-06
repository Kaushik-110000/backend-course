import { useEffect, useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Container from "../../container/Container.jsx";
import Logo from "../Logo.jsx";
import ToggleSlider from "../slider/ToggleSlider.jsx";
function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const avatarImage = useSelector((state) => state.auth.userData?.avatar);
  const userId = useSelector((state) => state.auth.userData?._id);
  const navigate = useNavigate();
  return (
    <header className="fixed left-0 top-0 bg-gray-900 text-white shadow-md py-4 w-full z-50">
      <Container>
        <div className="flex justify-between">
          <div className="flex ">
            <ToggleSlider className="mt-3 mr-3" />
            <div className="w-[10rem] h-[3rem] my-auto">
              <Logo />
            </div>
          </div>
          <div className="flex items-center space-x-6">
          {authStatus && avatarImage ? (
              <img
                src="/upload.svg"
                alt="Upload Video"
                className=""
                onClick={() => {
                  navigate(`/uploadVideo`);
                }}
              />
            ) : null}
            {authStatus && avatarImage ? (
              <img
                src={avatarImage}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover border border-white"
                onClick={() => {
                  navigate(`/channelPage/${userId}/videos`);
                }}
              />
            ) : null}
          </div>
        </div>
      </Container>
    </header>
  );
}

export default Header;
