import Image from "next/image";
import React from "react";
import logo from "/public/logo1.png";
const page = () => {
    return (
        <>
            <div
                className="absolute inset-0   bg-cover bg-center"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, rgba(200, 68, 68, 1), rgba(59, 130, 255, 1))",
                }}>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-screen object-fill opacity-70">
                    <source src="/finalbg.webm" type="video/webm" />
                    <source src="/finalbg.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            <div className="relative z-10 flex flex-col h-screen">
                <div className="flex justify-between items-center  px-4 sm:px-6 pt-4">
                    <Image src={logo} height={50} width={150} alt="Background Image" />
                </div>

                <div className="flex flex-col justify-center flex-1  px-4 sm:px-6 md:px-20 text-center sm:text-left absolute top-[15%]">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-black-900 leading-tight mb-4 sm:mb-6">
                        Let's Start Your
                    </h1>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-purple-900 leading-tight mb-4 sm:mb-6">
                        Journey!!
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-black-500  max-w-2xl mx-auto sm:mx-0 mb-8 sm:mb-10">
                        Unlock Your Potential, Empower Your Career.
                    </p>
                </div>
                <div className="absolute bottom-[10%] left-[6%]">
                    <a
                        href="/sign-up"
                        className="inline-block bg-purple-600 text-white font-bold text-lg px-25 py-3   rounded-xl animate-bounce shadow-xl hover:bg-purple-700 transition-all transform hover:scale-105">
                        Start Now
                    </a>
                </div>
            </div>
            <div className="container mx-auto px-4">
                <p className="text-lg md:text-xl text-gray-500 max-w-4xl mx-auto mb-8">
                    At PlacementReady, we believe that every career journey is an
                    opportunity for growth. We've built a platform that removes
                    the guesswork from job hunting, allowing you to focus on
                    what you do best. Our tools are designed to help you prepare
                    with confidence, build a professional brand, and stand out
                    in a competitive job market.
                </p>
                <p className="text-lg md:text-xl text-gray-500 max-w-4xl mx-auto mb-12">
                    Whether you are a recent graduate, a seasoned professional,
                    or considering a career change, your path to success starts
                    here. We're committed to providing the resources and
                    guidance you need to achieve your goals and predict your
                    future by creating it.
                </p>

                <section className="py-16 md:py-20 bg-gray-800">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
                            Your Toolkit for Success
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="bg-gray-950 p-6 md:p-8 rounded-xl shadow-md">
                                <h3 className="font-bold text-xl mb-2 text-white">
                                    Comprehensive Preparation
                                </h3>
                                <p className="text-gray-100">
                                    Access a vast library of interview
                                    questions, practice scenarios, and expert
                                    tips.
                                </p>
                            </div>
                            <div className="bg-gray-950 p-6 md:p-8 rounded-xl shadow-md">
                                <h3 className="font-bold text-xl mb-2 text-white">
                                    Professional Branding
                                </h3>
                                <p className="text-gray-100">
                                    Our resume-building tools help you create a
                                    powerful document that gets you noticed.
                                </p>
                            </div>
                            <div className="bg-gray-950 p-6 md:p-8 rounded-xl shadow-md">
                                <h3 className="font-bold text-xl mb-2 text-white">
                                    Data-Driven Insights
                                </h3>
                                <p className="text-gray-100">
                                    Get personalized feedback on your mock
                                    interviews to pinpoint areas for
                                    improvement.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12 md:py-16 text-center bg-gray-950">
                    <div className="container mx-auto px-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Ready to turn your next interview into a great
                            opportunity?
                        </h3>
                        <a
                            href="/sign-up"
                            className="inline-block bg-purple-600 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors transform hover:scale-105">
                            Get Started
                        </a>
                    </div>
                </section>
            </div>
        </>
    );
};

export default page;
