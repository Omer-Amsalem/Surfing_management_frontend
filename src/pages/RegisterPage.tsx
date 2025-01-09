import React, { useState } from "react";
import axios from "axios";
import InputField from "../components/InputField";
import Dropdown from "../components/Dropdown";
import PhotoUpload from "../components/PhotoUpload";

const roles = [
  "מדריך",
  "מתנדב",
  "בית הלוחם תל אביב",
  "בית הלוחם ירושלים",
  "אק\"ים",
  "הצעד הבא",
];

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("role", formData.role);

    if (profilePhoto) {
      formDataToSend.append("profilePhoto", profilePhoto);
    }
    else {
      formDataToSend.append("profilePhoto", "");
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/user/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Registration successful:", response.data);
      alert("Registration Successful!");
    } catch (error) {
      console.log("Error during registration:", formDataToSend.values());
      console.error("Error during registration:", error);
      alert("Registration Failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">
            Registration
          </h2>
          <PhotoUpload onFileSelect={(file) => setProfilePhoto(file)} />
          <p className="text-center text-gray-600 mb-4">
            Enter your details to register
          </p>
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
            <label className="block text-sm font-medium text-gray-600">
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
