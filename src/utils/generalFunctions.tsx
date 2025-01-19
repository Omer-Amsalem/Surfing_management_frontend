import axios from "axios";

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
                "http://localhost:3000/user/refreshToken",
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