"use client";

import axios from "axios";
import { useEffect } from "react";

const page = () => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/feedback`,
                    { withCredentials: true }
                );
                
            } catch (e) {
                toast.error("Failed to fetch feedback data");
            }
        };
        fetchData();
    }, []);
    return <div></div>;
};

export default page;
