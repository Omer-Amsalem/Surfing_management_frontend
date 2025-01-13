// HomePage.tsx
import React from 'react';
import Header from '../components/Header';
import Post from '../components/Post';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const userPhoto = localStorage.getItem('userPhoto') || '/images/default-user.png';
  const isHost = localStorage.getItem('isHost') === 'true';

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header pageTitle="Home" userPhoto={userPhoto} isHost={isHost} />
      <main className="flex-grow bg-gray-100 px-4 sm:px-6 md:px-8">
        <Post />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
