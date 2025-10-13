"use client";
import { useUser } from "@/utils/UserData";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
    const { resume, user } = useUser();
    const router = useRouter();
    const [formData, setFormData] = useState({
        jobRole: "",
        jobDescription: "",
        round_name: "HR Round",
        resume: {},
    });
    useEffect(() => {
        setFormData({
            ...formData,
            ["resume"]: resume,
            ["userId"]: user?._id,
        });
    }, [resume, user]);
    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
       // router.push("/interview/68cbb1e153eb2e9757eedede");
        e.preventDefault();
        if (!formData.resume) {
            return;
        }
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/interview`,
                formData
            );
            toast.success("Interview Created successfully");
            router.push(`/interview/${res.data.data._id}`);
        } catch (e) {
            console.log(e);
            toast.error(e.response.data.error);
        }
    };
    return (
        <>
            <div className="bg-gray-950 min-h-screen flex items-center  justify-center p-6">
                <form
                    method="POST"
                    onSubmit={handleSubmit}
                    className="w-full max-w-4xl bg-gray-900 border-2 border-purple-900  shadow-md shadow-purple-500 rounded-xl  p-8 space-y-8">
                    <div className="p-6 rounded-lg border-2 border-gray-700 hover:border-purple-600 transition-colors">
                        <h2 className="text-xl font-bold text-white mb-2">
                            Job Role
                        </h2>
                        <input
                            type="text"
                            name="jobRole"
                            value={formData.jobRole}
                            onChange={handleFormChange}
                            className="block w-full text-gray-300 bg-gray-800 rounded-lg border border-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                    </div>
                    <div className="p-6 rounded-lg border-2 border-gray-700 hover:border-purple-600 transition-colors">
                        <h2 className="text-xl font-bold text-white mb-2">
                            Description
                        </h2>
                        <input
                            type="textArea"
                            name="jobDescription"
                            value={formData.jobDescription}
                            onChange={handleFormChange}
                            className="block w-full text-gray-300 bg-gray-800 rounded-lg border border-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                    </div>
                    <div className="p-6 rounded-lg border-2 border-gray-700 hover:border-purple-600 transition-colors">
                        <h2 className="text-xl font-bold text-white mb-2">
                            Select Interview Round
                        </h2>
                        <select
                            name="round_name"
                            value={formData.round_name}
                            onChange={handleFormChange}
                            className="w-full bg-gray-800 text-gray-300 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-600">
                            <option>Technical Round</option>
                            <option>HR Round</option>
                            <option>Managerial Round</option>
                            <option>Final Round</option>
                        </select>
                    </div>

                    <div className="text-center">
                        <button
                            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg 
                     hover:from-purple-700 hover:to-purple-900 transform hover:scale-105 transition duration-300 ease-in-out">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default page;
