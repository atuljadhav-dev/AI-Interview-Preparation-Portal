import axios from "axios";


const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    withCredentials: true,
});

// Request Interceptor to handle SSR cookie forwarding
api.interceptors.request.use(async (config) => {
    // Check if we are running on the server
    if (typeof window === "undefined") {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const allCookies = cookieStore.toString(); // Get all browser cookies
        
        if (allCookies) {
            config.headers.Cookie = allCookies; // Manually attach to server request
        }
    }
    return config;
});

export default api;