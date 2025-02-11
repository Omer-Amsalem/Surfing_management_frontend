import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import GenericContainer from "../components/GenericContainer";
import { useAuth } from "../context/AuthContext";

const EditProfilePage: React.FC = () => {
  const { change, setChange} = useAuth();
  const [user, setUser] = useState<any>(null);
  console.log(user);
  const [formData, setFormData] = useState({
    userPhoto: null as File | null, 
    firstName: "",
    lastName: "",
    description: "",
    role: "",
  });

  const [preview, setPreview] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = localStorage.getItem("user");
      if (!userData) {
        toast.error("No user data found. Please log in.");
        navigate("/login");
        return;
      }

      const user = JSON.parse(userData);
      const token = user.accessToken;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/getUser/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(response.data);
        setPreview(response.data.profilePicture ? `${import.meta.env.VITE_API_URL}/${response.data.profilePicture}` : "");
        setFormData((prev) => ({
          ...prev,
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          description: response.data.description || "",
          role: response.data.role || "",
        }));
      } catch (error) {
        toast.error("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        userPhoto: file,
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = user.accessToken;
      const refreshToken = user.refreshToken;
      if (!token) throw new Error("No access token found");

      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("role", formData.role);

      if (formData.userPhoto) {
        formDataToSend.append("profilePicture", formData.userPhoto);
      }

      const response = await axios.put(`${import.meta.env.VITE_API_URL}/user/update`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      localStorage.setItem("user", JSON.stringify({ ...user, ...response.data.user, accessToken: token, refreshToken }));


      setChange(change + 1);

      toast.success("Profile updated successfully!");
      navigate(`/profile/${user.id}`);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };


  return (
    <div>
      <div className="sticky top-0 z-20 bg-white shadow-md">
        <Header pageTitle="Edit Profile" />
      </div>
      <GenericContainer>
      <div className="flex flex-col items-center mb-8">
      {preview ? (
        <img
          src={preview}
          alt={`${formData.firstName} ${formData.lastName}`}
          className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md object-cover"
        />
      ) : (
        <div className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md flex items-center justify-center bg-gray-200">
          <span className="text-gray-500 text-lg">No Image</span>
        </div>
      )}
      <label className="mt-4 text-blue-600 text-sm font-medium cursor-pointer hover:underline">
        Upload New Photo
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </label>
    </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 text-left">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 text-left">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 text-left">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {[
                "מדריך",
                "מתנדב",
                "בית הלוחם תל אביב",
                "בית הלוחם ירושלים",
                'אק"ים',
                "הצעד הבא",
              ].map((roleOption) => (
                <option key={roleOption} value={roleOption}>
                  {roleOption}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 text-left">About Me</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={4}
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Save Changes
          </button>
        </form>
      </GenericContainer>
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md">
        <Footer />
      </div>
    </div>
  );
};

export default EditProfilePage;
