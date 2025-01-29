import React from "react";

interface GenericContainerProps {
  children: React.ReactNode;
}

const GenericContainer: React.FC<GenericContainerProps> = ({ children }) => {
  return (
    <div className="bg-gray-100 flex flex-col min-h w-full">
      <div className="flex flex-col flex-1 max-w-screen-md mx-auto w-full px-4 sm:px-6 md:px-8 bg-white shadow-lg rounded-lg py-8">
        {children}
      </div>
    </div>
  );
};

export default GenericContainer;
