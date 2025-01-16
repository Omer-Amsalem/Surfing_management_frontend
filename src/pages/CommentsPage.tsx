import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Comment from "../components/comment";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CommentsPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>(); // Get postId from the route

  const [comments, setComments] = useState<
    {
      firstName: string;
      lastName: string;
      profileImage?: string;
      content: string;
      timestamp: string;
    }[]
  >([]);
  const [newComment, setNewComment] = useState<string>(""); // Input for a new comment
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch comments when the component mounts

  

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header pageTitle="Comments" />

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-4 p-4">
   
      </div>

      {/* Add Comment Section */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow">
      
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CommentsPage;
