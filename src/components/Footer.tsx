// Footer Component
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-500 text-white py-4 flex flex-col items-center space-y-2">
      <p>Follow us on:</p>
      <div className="flex space-x-4">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <img src="/images/facebook-icon.png" alt="Facebook" className="w-6 h-6" />
        </a>
        <a href="https://google.com" target="_blank" rel="noopener noreferrer">
          <img src="/images/google-icon.png" alt="Google" className="w-6 h-6" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;