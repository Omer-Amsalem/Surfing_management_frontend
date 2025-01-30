import React from 'react';
import { useNavigate } from 'react-router-dom';

const EnteryPage: React.FC = () => {
    const navigate = useNavigate(); // Hook for navigation

    return (
        <div className="relative w-full h-screen bg-gray-900">
            {/* Video Background Container */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 backdrop-blur-md">
                    {/* Local Video */}
                    <video
                        className="w-full h-full object-cover"
                        src="/images/1757800-uhd_2560_1440_25fps.mp4"
                        autoPlay
                        playsInline
                        loop
                        muted
                    />
                </div>
            </div>

            {/* Logo Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in "> 
                {/* Main Logo */}
                <img
                    src="/images/zoomed_logo-removebg-preview.png"
                    alt="Logo"
                    className=""
                />

                {/* "Let's Surf!" Button */}
                <button
                    onClick={() => navigate('/login')}
                    className="mt-4 px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition duration-300 animate-fade-in-delay-1"
                >
                    Let's Surf!
                </button>

                {/* Row of 3 Logos */}
                <div className="flex space-x-6 md:space-x-8 lg:space-x-10 mt-8 animate-fade-in-delay-2">
                    <img
                        src="/images/akim_logo-removebg-preview.png"
                        alt="Logo 1"
                        className="w-20 md:w-20 lg:w-24"
                    />
                    <img
                        src="/images/next_step_logo-removebg-preview.png"
                        alt="Logo 2"
                        className="w-40 md:w-20 lg:w-24"
                    />
                    <img
                        src="/images/soldier_home_logo-removebg-preview.png"
                        alt="Logo 3"
                        className="w-20 md:w-20 lg:w-24"
                    />
                </div>
            </div>
        </div>
    );
};

export default EnteryPage;
