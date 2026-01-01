"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import interview from "/public/home.png";
import Image from "next/image";
import InterviewCard from "./InterviewCard";
import axios from "axios";
const HomePage = () => {
    const router = useRouter();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [filteredInterview, setFilteredInterview] = useState([]);
    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/interview`,
                    { withCredentials: true }
                );
                setInterviews(res.data.data);
                setFilteredInterview(res.data.data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        fetchInterviews();
    }, []);
    useEffect(() => {
        if (filter === "all") {
            setFilteredInterview(interviews);
        } else if (filter === "done") {
            setFilteredInterview(interviews.filter((i) => i.status === "Done"));
        } else if (filter === "scheduled") {
            setFilteredInterview(interviews.filter((i) => i.status !== "Done"));
        } else if (filter === "recent") {
            const sorted = [...interviews].sort(
                (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
            );
            setFilteredInterview(sorted);
        }
    }, [filter, interviews]);
    return (
        <>
            <div className="bg-gray-950 min-h-[calc(100%-4rem)] w-full md:py-0">
                <div className="container mx-auto h-full flex flex-col md:flex-row items-center justify-between px-6 md:px-10">
                    <div className="w-full md:w-5/12 flex flex-col items-center md:items-start text-center md:text-left order-1 md:order-1 mt-8 md:mt-0">
                        <div className="w-full md:max-w-md h-auto  mb-8">
                            <Image
                                src={interview}
                                className="w-auto h-[40vh] m-auto"
                                alt="image"></Image>
                        </div>
                        <div className="mb-6 w-full px-5">
                            <p className="text-3xl sm:text-4xl lg:text-5xl text-white font-sans font-extrabold leading-tight">
                                AI-Powered
                            </p>
                            <p className="text-3xl sm:text-4xl lg:text-5xl text-purple-500 font-sans font-extrabold leading-tight">
                                Interview
                            </p>
                            <p className="text-3xl sm:text-4xl lg:text-5xl text-white font-sans font-extrabold leading-tight">
                                Preparation Portal
                            </p>
                        </div>
                        <p className="text-gray-400 text-base sm:text-lg md:text-xl font-sans font-medium max-w-lg mb-8 px-5">
                            Practice mock interviews with voice, receive instant
                            personalized feedback, track progress with scores,
                            and build the confidence needed for real interviews.
                        </p>
                    </div>
                    <div className="w-full md:w-6/12 flex justify-center items-center order-2 md:order-2 mb-10 md:mb-0">
                        <div className="flex flex-col items-center">
                            <div className="backdrop-blur-sm bg-white/20 w-[90vw] h-[40vh] max-w-md sm:w-[400px] sm:h-[400px] rounded-xl flex justify-center items-center p-2">
                                <div className="bg-black/40 w-full h-full rounded-xl flex justify-center items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="15vh"
                                        viewBox="0 -960 960 960"
                                        width="20vw"
                                        fill="#8C1AF6">
                                        <path d="m627-287 45-45-159-160v-201h-60v225l174 181ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-82 31.5-155t86-127.5Q252-817 325-848.5T480-880q82 0 155 31.5t127.5 86Q817-708 848.5-635T880-480q0 82-31.5 155t-86 127.5Q708-143 635-111.5T480-80Zm0-400Zm0 340q140 0 240-100t100-240q0-140-100-240T480-820q-140 0-240 100T140-480q0 140 100 240t240 100Z" />
                                    </svg>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    router.push("/interview");
                                }}
                                className="bg-purple-500 cursor-pointer mt-12 justify-start items-start rounded-xl sm:font-semibold font-sansmy-15 transition hover:-translate-y-1 hover:scale-110 hover:bg-purple-400 ease-in w-[150px] sm:h-10 sm:w-[250px] mx-15 ">
                                Start Interview
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-10 mt-20">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="md:text-2xl text-xl text-white font-bold mb-6">
                        Your Previous Interviews
                    </h2>
                    <select
                        value={filter}
                        className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        onChange={(e) => {
                            setFilter(e.target.value);
                        }}>
                        <option value="all">All</option>
                        <option value="done">Done</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="recent">Recent</option>
                    </select>
                </div>
                {loading ? (
                    <p className="text-gray-400">Loading interviews...</p>
                ) : filteredInterview.length === 0 ? (
                    <p className="text-gray-400">No interviews found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredInterview?.map((interview) => {
                            return <InterviewCard interview={interview} />;
                        })}
                    </div>
                )}
            </div>
        </>
    );
};
export default HomePage;
