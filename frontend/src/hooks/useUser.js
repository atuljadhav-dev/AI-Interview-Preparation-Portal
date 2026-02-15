"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [resumes, setResumes] = useState(null);
    const [loading, setLoading] = useState(true);
    const refreshUser = async () => {
        setLoading(true);
        const authToken = Cookies.get("authToken");
        //only works for different domain and cookies set by js-cookies which help to access the cookes by javascript
        if (
            !authToken &&
            process.env.NEXT_PUBLIC_ENVIRONMENT != "development"
        ) {
            setUser(null);
            setResumes(null);
            setLoading(false);
            return;
        }
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify`,
                { withCredentials: true } //to send cookies with the request
            );
            if (res.data.success) {
                setUser(res.data.data);
                await refreshResume();
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
            if (err.response?.status === 401 || err.response?.status === 403) {
                Cookies.remove("authToken");
            }
        } finally {
            setLoading(false);
        }
    };
    const refreshResume = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/resumes`,
                { withCredentials: true } //to send cookies with the request
            );
            setResumes(response.data?.data || null);
        } catch (resumeErr) {
            setResumes(null);
        } finally {
            setLoading(false);
        }
    };
    const signOut = () => {
        setUser(null);
        setResumes(null);
        Cookies.remove("authToken");
    };
    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                resumes,
                loading,
                refreshUser,
                refreshResume,
                signOut,
            }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
