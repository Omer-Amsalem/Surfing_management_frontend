import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface EditProfileProps {
  userPhoto: string;
  firstName: string;
  lastName: string;
  description: string;
  email: string;
  password: string;
  role: string;
}

const roles = [
  "מדריך",
  "מתנדב",
  "בית הלוחם תל אביב",
  "בית הלוחם ירושלים",
  'אק"ים',
  "הצעד הבא",
];

const EditProfile = ({
  userPhoto,
  firstName,
  lastName,
  description,
  email,
  password,
  role,
}: EditProfileProps) => {
  // State to handle form data
  const [formData, setFormData] = useState({
    userPhoto,
    firstName,
    lastName,
    description,
    email,
    password,
    role,
  });

  // Navigation hook
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, userPhoto: reader.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Handle form save
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) throw new Error("No access token found");

      // Create FormData object to handle file uploads
      const formData = new FormData();

      // Append form fields to FormData
      formData.append("firstName", formData.get("firstName")!);
      formData.append("lastName", formData.get("lastName")!);
      formData.append("role", formData.get("role")!);
      formData.append("description", formData.get("description")!);
      formData.append("email", formData.get("email")!);
      if (formData.get("userPhoto")) {
        formData.append("profilePicture", formData.get("userPhoto")!);
      }

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error: any) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mx-auto mt-4">
      {/* Profile photo */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={formData.userPhoto}
          alt={`${formData.firstName} ${formData.lastName}`}
          className="w-32 h-32 rounded-full border-2 border-blue-500 mb-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="text-sm text-gray-600"
        />
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-gray-800 font-semibold text-left mb-1">
            First Name:
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-semibold text-left mb-1">
            Last Name:
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-semibold text-left mb-1">
            About Me:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-semibold text-left mb-1">
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-semibold text-left mb-1">
            Password:
          </label>
          <input
            type="password"
            name="password"
            value="********"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-semibold text-left mb-1">
            Role:
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            {roles.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Save button */}
      <div className="mt-6">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white font-bold py-2 w-full rounded-md hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
