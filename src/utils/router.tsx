import {Routes, Route} from 'react-router-dom';
import Login from '../pages/LogInPage';
import Register from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';


const Router = () => {
    return (
        <Routes>
        <Route path="/Home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        </Routes>
    );
    };
export default Router;