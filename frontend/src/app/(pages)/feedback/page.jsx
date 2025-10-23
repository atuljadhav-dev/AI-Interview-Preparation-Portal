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
                console.log(res);
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, []);
    return <div></div>;
};

export default page;
