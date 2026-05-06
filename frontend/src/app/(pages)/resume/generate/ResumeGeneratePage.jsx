"use client";
import ResumePreview from "@/components/ResumePreview";
import { useUser } from "@/hooks/useUser";
import api from "@/utils/api";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ResumePage = () => {
    const searchParams = useSearchParams();
    const [resume, setResume] = useState({
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
                    "Developed user-friendly web interfaces utilizing HTML, CSS, JavaScript, and Bootstrap frameworks.",
                    "Designed and implemented responsive web pages, prioritizing seamless user experiences and functionality.",
                    "Integrated form validation and interactive features using JavaScript to enhance web application functionality.",
                    "Deployed responsive websites and various mini-projects using Netlify, demonstrating practical application of development concepts.",
                    "Applied debugging techniques and clean code practices to ensure robust and maintainable responsive designs.",
                ],
                title: "Web Developer Intern",
            },
        ],
        links: {
            github: "https://github.com/atuljadhav-dev",
            linkedin: "https://linkedin.com/in/atulmjadhav",
            others: [],
            portfolio: "https://atuljadhav.vercel.app",
        },
        name: "Atul Mohan Jadhav",
        optimization_notes: [
            "Summary rewritten to avoid first-person language and incorporate keywords from the Job Description, emphasizing frontend development, responsiveness, modern frameworks, and collaboration.",
            "Experience section rephrased with stronger action verbs and aligned with Job Description terminology (e.g., 'user-friendly web interfaces', 'responsive web pages', 'debugging').",
            "Project descriptions optimized to highlight frontend skills, responsive design, and integration relevant to the Frontend Developer role, using stronger verbs and JD keywords.",
            "Skill categories and items preserved; implicit prioritization within Frontend skills like JavaScript and React.js, which were matched by the ATS.",
            "Factual accuracy of titles, dates, institutions, and companies maintained as per strict rules.",
        ],
        projects: [
            {
                description: [
                    "Developed an AI-powered interview preparation platform simulating real interview experiences for students and job seekers.",
                    "Implemented a Flask backend with MongoDB to manage user profiles, session data, and interview content.",
                    "Integrated Gemini API for dynamic generation of technical and HR interview questions tailored to user profiles.",
                    "Provided automatic performance reports with personalized feedback and improvement suggestions post-session.",
                    "Designed and built an interactive frontend using Next.js and Tailwind CSS, ensuring a smooth and responsive user experience.",
                ],
                name: "PlacementReady- AI interview Portal",
            },
            {
                description: [
                    "Developed a personalized fitness and health tracking application, delivering tailored workout and diet plans based on user metrics.",
                    "Integrated Google’s Gemini API to power an AI chatbot for interactive fitness and nutrition queries.",
                    "Utilized Firebase for secure user management (Authentication) and scalable data storage (Realtime Database).",
                    "Implemented data visualization using Recharts to effectively display key health metrics such as BMI.",
                    "Designed a user-friendly and responsive interface, enhancing accessibility across various devices.",
                ],
                name: "FitBuddy",
            },
            {
                description: [
                    "Developed a GitHub repository analysis tool, generating a VS Code-style interactive file tree.",
                    "Integrated an AI chatbot to provide explanations of repository files and functions, enhancing code comprehension.",
                    "Leveraged the Octokit library for efficient interaction with the GitHub API.",
                    "Enabled seamless, interactive navigation of the file tree and direct viewing of code snippets.",
                ],
                name: "GitHubExplain",
            },
        ],
        skills: [
            {
                category: "Frontend",
                items: [
                    "JavaScript",
                    "React.js",
                    "HTML",
                    "CSS",
                    "Bootstrap",
                    "Tailwind CSS",
                    "Next.js",
                ],
            },
            {
                category: "Backend",
                items: [
                    "Python",
                    "Express.js",
                    "Flask",
                    "Node.js",
                    "Rest API",
                    "SQL",
                    "MongoDB",
                    "Firebase",
                ],
            },
            {
                category: "Others",
                items: [
                    "Git",
                    "GitHub",
                    "Postman",
                    "Netlify",
                    "Vercel",
                    "Visual Studio Code",
                ],
            },
        ],
        summary:
            "Results-driven Web Developer with a strong foundation in designing, developing, and maintaining responsive web applications. Possessing expertise in modern front-end frameworks like React, coupled with proficiency in core web technologies and basic back-end concepts. Proven ability to build user-friendly interfaces, ensure responsiveness, and collaborate effectively within development teams. Committed to delivering high-quality web solutions and adept at debugging and problem-solving to tackle complex challenges.",
    });
    const [jobDescription, setJobDescription] = useState("");
    const [selectedResume, setSelectedResume] = useState(null);
    const [report, setReport] = useState({});
    const [additionalResumes, setAdditionalResumes] = useState([]);
    const { resumes } = useUser();
    useEffect(() => {
        const atsId = searchParams.get("atsId");
        if (!atsId) return;

        const loadData = async () => {
            try {
                const { data } = await api.get(`/ats/report/${atsId}`);

                const atsReport = data?.data;
                if (!atsReport) return;

                setReport(atsReport.atsReport);

                if (resumes && resumes.length > 0) {
                    const foundResume = resumes.find(
                        (cur) =>
                            cur._id?.toString() ===
                            atsReport.resumeId?.toString()
                    );

                    if (foundResume) {
                        setSelectedResume(foundResume);
                    }
                }

                if (atsReport.jobId) {
                    const jobRes = await api.get(`/job/${atsReport.jobId}`);
                    setJobDescription(jobRes?.data?.data?.jobDescription || "");
                }

                toast.success("Report loaded successfully.");
            } catch (error) {
                console.error(error);
                toast.error("Failed to load ATS report.");
            }
        };

        loadData();
    }, [searchParams, resumes]);

    const handleSubmit = async () => {
        // Filter out the selected resume and get the resume data for the additional resumes
        const tmp = resumes
            .filter(
                (cur) =>
                    cur._id !== selectedResume._id &&
                    additionalResumes.includes(cur._id)
            )
            .map((cur) => cur.resume);
        try {
            const { data } = await api.post("/ai/resume", {
                jobDescription,
                resume: selectedResume.resume,
                atsReport: report,
                additionalResumes: tmp,
            });
            setResume(data?.data);
            console.log(data);
            toast.success("Resume generated successfully.");
        } catch (e) {
            toast.error("Failed to generate Resume.");
        }
    };
    return (
        <div className="min-h-screen p-4 flex items-center justify-center">
            <div
                className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 
    dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                    Resume Optimization
                </h1>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 sm:p-10 w-[90vw] sm:w-[420px] border border-white/30 dark:border-gray-700 transition">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Job Description
                        </label>
                        <input
                            type="text"
                            value={jobDescription}
                            placeholder="job"
                            onChange={(e) => {
                                setJobDescription(e.target.value);
                            }}
                            className=" px-4 py-2 rounded-lg border border-purple-300 
            focus:ring-2 focus:ring-purple-400 outline-none"
                        />
                    </div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        ATS Report
                    </label>
                    <input
                        type="text"
                        value={report ? JSON.stringify(report) : ""}
                        onChange={(e) => {
                            setReport(e.target.value);
                        }}
                        className=" px-4 py-2 rounded-lg border border-purple-300 
            focus:ring-2 focus:ring-purple-400 outline-none"
                    />
                    {/* show additional resume to select */}
                    {resumes?.map(
                        (r) =>
                            selectedResume &&
                            r._id !== selectedResume._id && (
                                <div key={r._id}>
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Additional Resume To Select{" "}
                                    </label>
                                    <input
                                        type="checkbox"
                                        value={r._id}
                                        checked={additionalResumes.includes(
                                            r._id
                                        )}
                                        className=" px-4 py-2 rounded-lg border border-purple-300 
            focus:ring-2 focus:ring-purple-400 outline-none"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                if (
                                                    additionalResumes.length >=
                                                    4
                                                ) {
                                                    alert(
                                                        "You can select maximum 4 additional resumes."
                                                    );
                                                    return;
                                                }
                                                setAdditionalResumes([
                                                    ...additionalResumes,
                                                    r._id,
                                                ]);
                                            } else {
                                                setAdditionalResumes(
                                                    additionalResumes.filter(
                                                        (id) => id !== r._id
                                                    )
                                                );
                                            }
                                        }}
                                    />
                                    {r.name}
                                </div>
                            )
                    )}

                    {/* select primary resume */}
                    {resumes && resumes.length > 0 ? (
                        <select
                            value={selectedResume ? selectedResume._id : ""}
                            onChange={(e) => {
                                const res = resumes.find(
                                    (cur) => cur._id === e.target.value
                                );
                                setSelectedResume(res ? res : null);
                            }}>
                            <option value="">Select Resume</option>
                            {resumes.map((res) => (
                                <option key={res._id} value={res._id}>
                                    {res.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div>No Resumes Found</div>
                    )}
                    <button
                        onClick={handleSubmit}
                        className="w-full py-3 rounded-lg font-semibold
          bg-gradient-to-r from-purple-600 to-blue-600 text-white 
          hover:scale-[1.02] hover:shadow-lg transition duration-300">
                        submit
                    </button>
                </div>
                {resume && <ResumePreview resume={resume} />}
            </div>
        </div>
    );
};

export default ResumePage;
