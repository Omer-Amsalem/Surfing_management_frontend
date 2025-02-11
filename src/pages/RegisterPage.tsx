import React, { useState } from "react";
import axios from "axios";
import InputField from "../components/InputField";
import Dropdown from "../components/Dropdown";
import PhotoUpload from "../components/PhotoUpload";
import { useNavigate } from "react-router-dom";
import Loader from "../components/genericComponents/Loader";

const roles = [
  "מדריך",
  "מתנדב",
  "בית הלוחם תל אביב",
  "בית הלוחם ירושלים",
  "אק\"ים",
  "הצעד הבא",
];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.role) {
      alert("All fields are required!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("role", formData.role);

    if (profilePhoto) {
      formDataToSend.append("profilePicture", profilePhoto); // Fixed key
    } else {
      formDataToSend.append("profilePicture", ""); // Fixed key
    }

    setIsLoading(true); // Set loading state

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/register`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response) {
        alert("Registration Successful!");
        // Navigate to login page after successful registration
        navigate("/login");
      }
    } catch (error: any) {
      const message = error.res?.data?.message || "Something went wrong!";
      console.error("Error during registration:", message);

      alert(`Registration Failed: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader message="Registering..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">
            Registration
          </h2>
          <PhotoUpload onFileSelect={(file) => setProfilePhoto(file)} />
          <p className="text-center text-gray-600 mb-4">
            Enter your details to register
          </p>
          <div className="text-left ">
            <InputField
              label="First Name"
              type="text"
              placeholder="Enter your first name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <InputField
              label="Last Name"
              type="text"
              placeholder="Enter your last name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 ">
                Role:
              </label>
              <Dropdown
                options={roles}
                selected={formData.role}
                onSelect={(role) => setFormData({ ...formData, role })}
              />
            </div>
            <InputField
              label="Email"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <InputField
              label="Password"
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              } text-white py-2 rounded-md`}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <a
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Log in here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
