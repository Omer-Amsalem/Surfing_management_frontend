// HomePage.tsx
import React from 'react';
import Header from '../components/Header';
import Post from '../components/Post';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const futurePostsApiUrl = `${import.meta.env.VITE_API_URL}/post/futurePosts?page=1&limit=10`;
  return (
    <div className="flex flex-col min-h-screen w-full ">
      {/* Header with full width */}
      <div className='sticky top-0 z-20'>
      <Header pageTitle="Home" />
      </div>
      
      {/* Main content area */}
      <main className="flex-grow bg-gray-100 px-4 sm:px-6 md:px-8 w-full">
        <Post apiUrl = {futurePostsApiUrl} />
      </main>
      
      {/* Footer with full width */}
      <div className="w-full sticky bottom-0">
      <Footer />
      </div>
    </div>
  );
};

export default HomePage;
