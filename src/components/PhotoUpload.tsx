import React, { ChangeEvent } from "react";

interface PhotoUploadProps {
  onFileSelect: (file: File | null) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onFileSelect }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    } else {
      onFileSelect(null);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600">
        Profile Photo:
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
      />
    </div>
  );
};

export default PhotoUpload;
