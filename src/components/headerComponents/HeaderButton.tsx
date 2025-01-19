import React from 'react';

interface HeaderButtonProps {
  onClick: () => void;
  icon: JSX.Element;
  className?: string;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({ onClick, icon, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center space-x-2 text-blue-500 bg-transparent hover:bg-blue-700 hover:text-white p-2 rounded-full transition-all duration-200 ${className}`}
  >
    {icon}
  </button>
);

export default HeaderButton;
