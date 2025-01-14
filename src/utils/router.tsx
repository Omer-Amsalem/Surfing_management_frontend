import {Routes, Route} from 'react-router-dom';
import Login from '../pages/LogInPage';
import Register from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';


const Router = () => {
    return (
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/createPost" element={<HomePage />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        </Routes>
    );
    };
export default Router;