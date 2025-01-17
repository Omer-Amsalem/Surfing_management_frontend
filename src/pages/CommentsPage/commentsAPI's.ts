import axios from "axios";
import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3000/comment";

export const getPostComment = async (postId: string, accestoken: string) => {
    const response = await axios.get(`${BASE_URL}/getComments/${postId}`, {
        headers: {
            Authorization: `Bearer ${accestoken}`
        }
    });
    return response.data;
}

export const createComment = async (id: string, content: string, token: string) => {
    const response = await axios.post(`${BASE_URL}/create/${id}`, { content }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

