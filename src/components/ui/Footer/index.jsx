import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {

  return (
    <div className="container mb-6 mt-4">
      <div className="flex items-center bg-black bg-opacity-30 text-white w-full py-3 px-5 rounded-lg justify-between">
        <div className="flex w-full justify-between items-center space-x-6">
          <Link to="/" className="font-semibold">
            Imagemagie{" "}
          </Link>
          <div className="flex gap-10">
            {/* <span>Footer</span> */}
            <Link className="font-semibold" to="https://t.me/isceassistant">
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Footer };
