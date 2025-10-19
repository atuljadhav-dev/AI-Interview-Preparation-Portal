"use client";
import Image from "next/image";
import interview from "/public/home.png";
import { useRouter } from "next/navigation";
import axios from "axios";

const home = () => {
    const router = useRouter();
    return (
        <div className="bg-gray-950 w-[100vw] h-[100vh] ">
            <div className="h-full w-full flex-row sm:flex items-center justify-evenly">
                {/*this is left */}
                <div className="h-full w-6/12  sm:justify-center items-center flex flex-col mx-5">
                    <div className="w-full h-[40vh] ">
                        <Image
                            src={interview}
                            className="w-[40vw] h-[40vh]"
                            alt="image"></Image>
                    </div>
                    <div className="h-[200px] w-full  ">
                        <p className="text-5xl sm:text-5xl text-white font-sans font-bold mx-5">
                            AI-Powered
                        </p>
                        <p className="text-5xl sm:text-5xl text-purple-500 font-sans font-bold mx-5">
                            Interview
                        </p>
                        <p className="text-5xl sm:text-5xl text-white font-sans font-bold mx-5">
                            Preparation Portal
                        </p>
                    </div>
                    <p className="text-gray-500 sm:text-2xl  font-sans font-semibold ">
                        Practice mock interviews with voice, receive instant
                        personalized feedback, track progress with scores, and
                        build the confidence needed for real interviews.
                    </p>
                </div>
                <div className=" h-full w-6/12  flex justify-center sm:items-center flex-col">
                    <div className="backdrop-blur-none  mt-12 bg-white/30 w-[60vw] h-[34vh] sm:w-[40vw] sm:h-[60vh] rounded-xl justify-center items-center flex">
                        <div className="backdrop-blur-none  bg-black/30 w-[50vw] h-[24vh] sm:w-[37vw] sm:h-[50vh] rounded-xl flex justify-center items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="20vh"
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
                        className="bg-purple-500 mt-12 justify-start items-start rounded-xl sm:font-semibold font-sansmy-15 transition hover:-translate-y-1 hover:scale-110 hover:bg-purple-400 ease-in w-[150px] sm:h-[40px] sm:w-[250px] mx-15 ">
                        Start Interview
                    </button>
                </div>
            </div>
        </div>
    );
};
export default home;
