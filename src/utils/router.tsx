import { Routes, Route } from "react-router-dom";
import Login from "../pages/LogInPage";
import Register from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import CreatePostPage from "../pages/CreatePostPage";
import UpdatePostPage from "../pages/UpdatePostPage"; // Import UpdatePostPage
import ProfilePage from "../pages/ProfilePage";
import ChatBot from "../pages/ChatBot";
import EditProfilePage from "../pages/EditProlilePage";
import CommentsPage from "../pages/CommentsPage";
import ParticipantsPage from "../pages/ParticipantsPage";
import EnteryPage from "../pages/EnteryPage";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<EnteryPage />} />
      <Route path="/chatBot" element={<ChatBot />} />
      <Route path="/createPost" element={<CreatePostPage />} />
      <Route path="/updatePost/:id" element={<UpdatePostPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/edit-profile" element={<EditProfilePage />} />
      <Route path="/comments/:id" element={<CommentsPage />} />
      <Route path="/participants/:id" element={<ParticipantsPage/>} />
    </Routes>
  );
};
export default Router;
