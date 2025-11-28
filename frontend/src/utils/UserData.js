"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserAndResume = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/verify`,
                    { withCredentials: true }//to send cookies with the request
                );
                if (res.data.success) {
                    const verifiedUser = res.data.data;
                    setUser(verifiedUser);
                    try {
                        const response = await axios.get(
                            `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
                            { withCredentials: true }//to send cookies with the request
                        );
                        setResume(response.data.data);
                    } catch (resumeErr) {
                        setResume(null);
                    }
                } else {
                    setUser(null);
                    setResume(null);
                }
            } catch (err) {
                setUser(null);
                setResume(null);
            } finally {
                setLoading(false);
            }
        };

        if (!user) {//to avoid infinite loop
            fetchUserAndResume();
        }
    }, []);

    return (
        <UserContext.Provider
            value={{ user, setUser, resume, setResume, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
