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
<<<<<<< HEAD
import EnteryPage from "../pages/EnteryPage";
=======
import ParticipantsPage from "../pages/ParticipantsPage";
>>>>>>> 48ac2c2ee25400af69c854c0a191a478d58189e2

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
