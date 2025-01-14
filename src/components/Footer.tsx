// Footer Component
import React from 'react';
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-500 text-white py-4 flex flex-col items-center space-y-2 w-full">
      {/* Social Media Text */}
      <p className="text-sm sm:text-base">Follow us on:</p>

      {/* Social Media Links */}
      <div className="flex space-x-4">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <FaFacebookSquare />
        </a>
        <a href="https://google.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
