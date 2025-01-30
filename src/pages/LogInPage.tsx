import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import InputField from "../components/InputField"; // Reuse the InputField component
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleLogin from '../components/googleLoginComponent';


const LoginPage: React.FC = () => {


  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state before submitting
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Save user data to local storage
      localStorage.setItem("user", JSON.stringify(response.data));
      const expiresIn = 50 * 60 * 1000;
      localStorage.setItem(
        'expiresAt',
        new Date(Date.now() + expiresIn).toISOString()
      );

      console.log("Login successful:", response.data);
      toast.success("Login Successful!");
      navigate("/home")
    } catch (error: any) {
      console.error("Error during login:", error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    }
  };
  const loginWithGoogle = async (authResult: any) => {
    if (authResult["code"]) {
      try {
        const response: Promise<AxiosResponse> = axios.post(
          `${import.meta.env.VITE_API_URL}/user/googlelogin`,
          {
            code: authResult["code"],
          }
        );
        response
          .then((resolvedResponse) => {
            const data = {
              email: resolvedResponse.data.user.email,
              id: resolvedResponse.data.user._id,
              accessToken: resolvedResponse.data.accessToken,
              refreshToken: resolvedResponse.data.refreshToken,
              isHost: resolvedResponse.data.user.isHost,
              userPhoto: resolvedResponse.data.user.profilePicture,
            };
            localStorage.setItem("user", JSON.stringify(data));
            const expiresIn = 50 * 60 * 1000;
            localStorage.setItem(
              'expiresAt',
              new Date(Date.now() + expiresIn).toISOString()
            );
            toast.success("Google login successful");
            navigate("/home")
          })
          .catch((error) => {
            console.error("Error:", error); // Handle any errors
          });
      } catch (error) {
        console.error(error);
        toast.error("Google login failed");
      }
    } else {
      console.error(authResult);
      toast.error("Google login failed");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">Log In</h2>
          <div className="flex justify-center mb-4">
            <img
              src="images\zoomed_logo.png"
              alt="Logo"
              className="h-20 w-25 rounded-full shadow-lg"
            />
          </div>
          <p className="text-center text-gray-600 mb-4">Enter your details to sign in</p>

          {/* Email Field */}
          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />

          {/* Password Field */}
          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 mb-4"
          >
            Sign in
          </button>

          {/* Sign In with Google */}
          <div className="flex items-center justify-center space-x-2">
          <GoogleLogin authResponse={loginWithGoogle} />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600">
            Don't have a user yet?{" "}
            <a
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              sign up here

            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
