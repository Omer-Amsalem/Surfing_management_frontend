import {Routes, Route} from 'react-router-dom';
import Login from '../pages/LogInPage';
import Register from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import CreatePostPage from '../pages/CreatePostPage';


const Router = () => {
    return (
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/createPost" element={<CreatePostPage />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        </Routes>
    );
    };
export default Router;