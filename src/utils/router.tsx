import {Routes, Route} from 'react-router-dom';
import Login from '../pages/LogInPage';
import Register from '../pages/RegisterPage';

const Router = () => {
    return (
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        </Routes>
    );
    };
export default Router;