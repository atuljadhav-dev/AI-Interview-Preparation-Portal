"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ReportPage = ({ id }) => {
    const [report, setReport] = useState(null);
    const router = useRouter();
    useEffect(() => {
        const fetchReport = async () => {
            try {
                const { data } = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/ats/report/${id}`,
                    {
                        withCredentials: true,
                    }
                );
                setReport(data?.data);
                toast.success("Report fetched successfully.");
            } catch (e) {
                toast.error("Failed to fetch report.");
            }
        };
        fetchReport();
    }, [id]);
    return (
        <div>
            {" "}
            {report && (
                <>
                    <button
                        onClick={() => {
                            router.push(
                                `/resume/generate?atsId=${report?._id}`
                            );
                        }}>
                        Fix Resume
                    </button>
                </>
            )}
        </div>
    );
};

export default ReportPage;
