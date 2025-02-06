import React from "react";

function Popup({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="  bg-opacity-50 fixed my-20 mx-auto z-40 top-80 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="relative flex items-center justify-center bg-white p-6 rounded-lg shadow-lg w-80 h-125">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">
          ✖
        </button>
        {/* Popup Content */}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export default Popup;
