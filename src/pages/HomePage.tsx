// HomePage.tsx
import React from 'react';
import Header from '../components/Header';
import Post from '../components/Post';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const futurePostsApiUrl = 'http://localhost:3000/post/futurePosts';
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header with full width */}
      <Header pageTitle="Home" />
      
      {/* Main content area */}
      <main className="flex-grow bg-gray-100 px-4 sm:px-6 md:px-8 w-full">
        <Post apiUrl = {futurePostsApiUrl} />
      </main>
      
      {/* Footer with full width */}
      <Footer />
    </div>
  );
};

export default HomePage;
