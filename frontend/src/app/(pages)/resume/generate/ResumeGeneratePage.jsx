"use client";
import ResumePreview from "@/components/ResumePreview";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ResumePage = () => {
    const [Resume, setResume] = useState({
        certifications: [
            "Python and Flask Framework Complete Course – Udemy",
            "Data Structures and Algorithms using Java – NPTEL",
        ],
        contact: {
            email: "atulj9537@gmail.com",
            location: "Karad, Maharashtra",
            phone: "+91-7887477957",
        },
        education: [
            {
                dates: "11/2022 – Present",
                degree: "B. Tech in Computer Science and Engineering",
                details: "CGPA- 7.9",
                institution: "D. Y . Patil Technical Campus, Talsande",
            },
            {
                dates: "06/2021 – 04/2022",
                degree: "Higher Secondary Certificate (HSC)",
                details: "Percentage-77",
                institution: "Krishna Mahavidyalaya, Rethare Bk",
            },
            {
                dates: "06/2019 – 04/2020",
                degree: "Secondary School Certificate (SSC)",
                details: "Percentage- 92",
                institution:
                    "Sou. Tarabai Madhavrao Mohite Vidyalaya, Rethare Bk",
            },
        ],
        experience: [
            {
                company: "Plasmid Innovation LTD",
                dates: "06/2025 – 08/2025",
                location: "Bengaluru",
                responsibilities: [
                    "Engaged in frontend development, applying HTML5, CSS3, JavaScript (ES6+), and Bootstrap to build web interfaces.",
                    "Designed and developed responsive web pages, emphasizing user-friendly (UI/UX) interfaces.",
                    "Implemented JavaScript for form validation and interactive features.",
                    "Developed and deployed mini-projects to Netlify, reinforcing core web development concepts.",
                    "Improved skills in debugging, responsive design principles, and clean code practices.",
                ],
                title: "Web Developer Intern",
            },
        ],
        name: "Atul Mohan Jadhav",
        links: {
            linkedin: "https://www.linkedin.com/in/atul-mohan-jadhav-9537/",
            github: "https://github.com/atulj9537",
            portfolio: "https://atulj9537.github.io/Portfolio/",
            other: ["https://www.google.com/maps/place/Karad,+Maharashtra"],
        },
        optimization_notes: [
            "Enhanced summary for MERN stack and full-stack development keyword alignment, incorporating soft skills.",
            "Categorized skills into specific areas (e.g., Programming Languages, Web Fundamentals) and aligned items with JD keywords (e.g., JavaScript (ES6+), HTML5, CSS3, RESTful APIs).",
            "Reworded experience and project descriptions using stronger action verbs and emphasized relevant technologies (e.g., MongoDB, Next.js, Tailwind CSS, Netlify) to better match Junior MERN Stack Developer requirements and highlight full-stack capabilities.",
        ],
        projects: [
            {
                description: [
                    "Developed an AI-powered interview preparation platform, simulating real interview experiences for students and job seekers.",
                    "Engineered a Flask backend with MongoDB for robust user, session, and interview data management.",
                    "Integrated Google's Gemini API to generate dynamic technical and HR interview questions tailored to user profiles.",
                    "Implemented automatic performance reports, providing feedback and improvement suggestions post-session.",
                    "Designed an interactive and responsive frontend using Next.js and Tailwind CSS, ensuring a smooth user experience.",
                ],
                name: "PlacementReady- AI interview Portal",
            },
            {
                description: [
                    "Created a personalized fitness and health tracking application, delivering tailored workout and diet plans based on user metrics.",
                    "Integrated Google’s Gemini API to power an AI chatbot for interactive fitness and nutrition queries.",
                    "Utilized Firebase Realtime Database for efficient data storage and Firebase Authentication for secure user management.",
                    "Implemented data visualization using Recharts to dynamically display key metrics such as BMI.",
                    "Designed a user-friendly interface with responsive components, enhancing accessibility across devices.",
                ],
                name: "FitBuddy",
            },
            {
                description: [
                    "Developed a tool for analyzing GitHub repositories, generating a VS Code-style interactive file tree.",
                    "Integrated an AI chatbot to provide explanations of repository files and their functions.",
                    "Utilized the Octokit library to effectively interact with the GitHub API.",
                    "Enabled seamless, interactive navigation of the file tree and convenient viewing of code snippets.",
                ],
                name: "GitHubExplain",
            },
        ],
        skills: [
            {
                category: "Programming Languages",
                items: ["JavaScript (ES6+)", "Python"],
            },
            {
                category: "Frontend Development",
                items: ["React.js", "Next.js", "Tailwind CSS", "Bootstrap"],
            },
            {
                category: "Backend Development",
                items: ["Node.js", "Express.js", "Flask", "RESTful APIs"],
            },
            {
                category: "Databases",
                items: ["MongoDB", "Firebase (NoSQL)", "SQL"],
            },
            {
                category: "Web Fundamentals",
                items: ["HTML5", "CSS3", "DOM Manipulation"],
            },
            {
                category: "Version Control",
                items: ["Git", "GitHub"],
            },
            {
                category: "Tools & Platforms",
                items: ["Postman", "Netlify", "Vercel", "Visual Studio Code"],
            },
        ],
        summary:
            "A motivated and results-driven Junior MERN Stack Developer with a solid foundation in full-stack development. Proficient in designing, developing, and maintaining responsive web applications using a variety of front-end (React.js, Next.js, Tailwind CSS) and backend (Node.js, Express.js, Flask, MongoDB) technologies. Eager to learn, adapt to new technologies, and collaborate effectively within cross-functional teams to deliver high-quality web solutions.",
    });
    const [jobDescription, setJobDescription] = useState("");
    const [selectedResume, setSelectedResume] = useState(null);
    const { resume } = useUser();
    const handleSubmit = async () => {
        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/ai/resume`,
                {
                    jobDescription,
                    resume: selectedResume,
                    atsReport: {},
                    additionalResumes: [],
                },
                {
                    withCredentials: true,
                }
            );
            setResume(data?.data);
        } catch (e) {
            toast.error("Failed to generate Resume.");
        }
    };

    return (
        <div>
            <input
                type="text"
                value={jobDescription}
                onChange={(e) => {
                    setJobDescription(e.target.value);
                }}
            />
            {resume && resume.length > 0 ? (
                <select
                    value={selectedResume ? selectedResume._id : ""}
                    onChange={(e) => {
                        const res = resume.find(
                            (cur) => cur._id === e.target.value
                        );
                        setSelectedResume(res.resume);
                    }}>
                    <option value="">Select Resume</option>
                    {resume.map((res) => (
                        <option key={res._id} value={res._id}>
                            {res.name}
                        </option>
                    ))}
                </select>
            ) : (
                <div>No Resumes Found</div>
            )}
            <button onClick={handleSubmit}>submit</button>
            {Resume && <ResumePreview resume={Resume} />}
        </div>
    );
};

export default ResumePage;
