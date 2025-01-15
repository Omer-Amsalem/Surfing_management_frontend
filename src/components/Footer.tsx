import React from 'react';
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";

const Footer: React.FC = () => {
  return (
    <footer className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg w-full">
      {/* Social Media Text and Links */}
      <div className="flex items-center space-x-4">
        <p className="text-sm sm:text-base">Follow us on:</p>
        <a 
          href="https://www.facebook.com/hagolshim.rz/?locale=he_IL" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Facebook"
        >
          <FaFacebookSquare className="text-white text-2xl hover:text-blue-300 transition-colors" />
        </a>
        <a 
          href="https://www.instagram.com/hagolshim.rlz/" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Instagram"
        >
          <FaInstagram className="text-white text-2xl hover:text-blue-300 transition-colors" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
