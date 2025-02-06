import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../Logout.jsx";
import authservice from "../../Backend/auth.config.js";
import { logOut } from "../../store/authSlice.js";
function Slider() {
  const dispatch = useDispatch();
  const stat = useSelector((state) => state.toggle.status);
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [navItems, setNavItems] = useState([]);

  const handleLogoutClick = async (e) => {
    console.log("out here");
    try {
      await authservice.logout();
      dispatch(logOut());
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    setNavItems([
      {
        name: "Home",
        lnk: "/",
        active: true,
        img: "/home.svg",
      },
      {
        name: "Log-In",
        lnk: "/login",
        active: !authStatus,
        img: "/Login.svg",
      },
      {
        name: "Register",
        lnk: "/register",
        active: !authStatus,
        img: "/Register.svg",
      },
      {
        name: "Change Password",
        lnk: "/changePassword",
        active: authStatus,
        img: "/password.svg",
      },
      {
        name: "Update Details",
        lnk: "/updateDetails",
        active: authStatus,
        img: "/settings.svg",
      },
      {
        name: "Watch History",
        lnk: "/watchHistory",
        active: authStatus,
        img: "/clock.svg",
      },
    ]);
  }, [authStatus]);

  return (
    <div className="flex ">
      <div
        className={`fixed left-0 top-20 transition-all duration-0 ${
          stat ? "w-64" : "w-16"
        } bg-gray-800 h-[200vh] z-50`}
      >
        <ul className="items-center space-x-6">
          {navItems.map((item) =>
            item.active ? (
              <li key={item.name}>
                <div
                  className="flex ml-3 mt-4"
                  onClick={() => navigate(item.lnk)}
                >
                  <img src={item.img} alt={item.name} />
                  {stat ? (
                    <p
                      id={`button-${item.name}`}
                      className="text-white text-sm ml-4"
                    >
                      {item.name}
                    </p>
                  ) : null}
                </div>
              </li>
            ) : null
          )}
        </ul>
        {authStatus ? (
          <div className="flex ml-3 mt-4 " onClick={handleLogoutClick}>
            <img src="/Logout.svg" alt="Logout" />
            {stat ? <LogoutButton className="ml-4" /> : null}
          </div>
        ) : null}
      </div>

      <div className="flex-1 p-4 ml-13 mt-11 pt-8">
        <Outlet />
      </div>
    </div>
  );
}

export default Slider;
