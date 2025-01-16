
import { Routes, Route } from "react-router-dom";
import Login from "../pages/LogInPage";
import Register from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import CreatePostPage from "../pages/CreatePostPage";
import UpdatePostPage from "../pages/UpdatePostPage"; // Import UpdatePostPage
import ProfilePage from "../pages/ProfilePage";
import ChatBot from "../pages/ChatBot";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chatBot" element={<ChatBot />} />
      <Route path="/createPost" element={<CreatePostPage />} />
      <Route path="/updatePost/:id" element={<UpdatePostPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<ProfilePage />} />

    </Routes>
  );
};
export default Router;

