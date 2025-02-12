import axios from "axios";

const user = JSON.parse(localStorage.getItem("user") || "{}");
const accessToken = user.accessToken;

// Helper function to convert date from `DD/MM/YYYY` to `YYYY-MM-DD`
export const convertToISODate = (date: string): string => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
};
// Helper function to detect if the text is RTL
export const isRTL = (text: string): boolean => {
    const rtlRegex = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlRegex.test(text);
};

export const getAccessToken = async (user: any) => {
    if (!user.accessToken && !user.refreshToken) {
        return null;
    }

    const expirationDate = new Date(localStorage.getItem("expiresAt") || "");

    if (expirationDate <= new Date()) {
        if (!user.refreshToken) {
            return null;
        }
        // Refresh the access token
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/user/refreshToken`,
                { token: user.refreshToken }
            );
            user.accessToken = response.data.accessToken;
            user.refreshToken = response.data.refreshToken;
            localStorage.setItem("user", JSON.stringify(user));
            const expiresIn = 50 * 60 * 1000;
            localStorage.setItem(
                "expiresAt",
                new Date(Date.now() + expiresIn).toISOString()
            );
        } catch (error) {
            console.error("Error refreshing token:", error);
            return null;
        }
    }
    return user.accessToken;
}

export const getFuturePost = async (
    page: number = 1,
    limit: number = 20,
    accessToken: string
) => {
    const futurePostsApiUrl = `${import.meta.env.VITE_API_URL}/post/futurePosts?page=${page}&limit=${limit}`;
    try {
        console.log(accessToken);
        const response = await axios.get(futurePostsApiUrl,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data as string);
        }
        throw new Error("Unknown error when trying to get a post");
    }
};
export const getUserPosts = async (
    page: number = 1,
    limit: number = 20,
    accessToken: string
) => {
    const userPostsApiUrl = `${import.meta.env.VITE_API_URL}/user/activities?page=${page}&limit=${limit}`;
    try {
        const response = await axios.get(userPostsApiUrl,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data as string);
        }
        throw new Error("Unknown error when trying to get a post");
    }
};