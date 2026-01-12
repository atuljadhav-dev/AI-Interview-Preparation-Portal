"use client";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Award,
    BookOpen,
    Briefcase,
    Type,
    List,
} from "lucide-react";

const ResumePage = () => {
    const [report, setReport] = useState({
        atsScore: 72,
        formattingCheck: {
            repetitionCheck:
                "There is some repetition of verbs like 'designed', 'developed', and 'implemented' in project and experience descriptions, which is common but could be varied for diver impact.",
            skillCasingErrors: [
                "Rest API (should be REST API or RESTful APIs)",
            ],
            usageOfActiveVoice:
                "The resume generally uses active voice effectively in project and experience descriptions, using div action verbs like 'Built', 'Implemented', 'Designed', 'Developed', 'Integrated', 'Created'.",
        },
        grammerCheck: {
            correctionsSuggested: [
                "Correct 'T ailwind CSS' to 'Tailwind CSS' in the 'PlacementReady' project description.",
                "Ensure consistent punctuation for academic scores, e.g., 'CGPA: 7.9', 'Percentage: 77'.",
            ],
            grammarIssuesFound: true,
            spellingErrorsFound: true,
        },
        recommendation: {
            interviewRecommendation:
                "divly recommended for an interview. The candidate demonstrates a solid understanding of core MERN stack technologies and has relevant project experience, which is crucial for a junior role. Their eagerness to learn and ability to apply skills in complex projects make them a promising candidate.",
            resumeRecommendation:
                "The resume is well-structured and highlights relevant skills and projects effectively. To further strengthen it, focus on adding quantifiable results, explicitly detailing specific MERN sub-skills mentioned in the job description, and addressing minor formatting/grammatical issues.",
        },
        recruiterTips: {
            improvementSuggestions: [
                "Quantify achievements in project descriptions and internship experience using metrics (e.g., 'Improved user engagement by X%', 'Reduced loading time by Y%', 'Handled Z users').",
                "Elaborate on specific React features used (e.g., Hooks, Context API) within project details to directly address JD requirements.",
                "Explicitly mention CRUD operations and schema design for MongoDB projects to demonstrate database management skills more clearly.",
                "Consider demonstrating knowledge of Redux/Zustand or JWT/OAuth through a new small project or by updating an existing one.",
                "While Python/Flask projects are good, ensure the MERN-specific projects are highlighted and detailed to align perfectly with the job description.",
            ],
            measurableResultsFound: false,
        },
        searchability: {
            emailPresent: true,
            jobTitleMatch: true,
            linkedinPresent: true,
            locationPresent: true,
            namePresent: true,
            phonePresent: true,
        },
        skillsAnalysis: {
            hardSkillsMatched: [
                "MongoDB",
                "Express.js",
                "React.js",
                "Node.js",
                "HTML",
                "CSS",
                "JavaScript",
                "Tailwind CSS",
                "Bootstrap",
                "RESTful APIs",
                "Git",
                "GitHub",
                "Postman",
                "Vercel",
                "Netlify",
                "JSON",
                "DOM manipulation",
            ],
            hardSkillsMissing: [
                "Mongoose",
                "Redux",
                "Zustand",
                "Hooks",
                "Functional Components",
                "Context API",
                "CRUD operations (explicit mention)",
                "Aggregations (explicit mention)",
                "JWT",
                "OAuth",
                "Heroku",
            ],
            softSkillsFound: [
                "Analytical and problem-solving mindset",
                "Good communication skills",
                "Ability to work independently and as part of a team",
                "Eagerness to learn and adapt to new technologies",
                "Results-driven",
            ],
        },
        summary:
            "The candidate, Atul Mohan Jadhav, presents a div foundation for a Junior MERN Stack Developer role, despite being a fresher. They demonstrate proficiency in the core MERN technologies (MongoDB, Express.js, React.js, Node.js) through relevant projects and an internship experience. Key strengths include practical application of skills in full-stack projects, experience with modern frameworks like Next.js, and essential tools like Git, GitHub, and Postman. While lacking explicit mention of some advanced React concepts or specific MongoDB operations, the overall profile indicates a capable and eager-to-learn individual.",
    });
    const [jobDescription, setJobDescription] = useState("");
    const [selectedResume, setSelectedResume] = useState(null);
    const { resume } = useUser();
    const handleSubmit = async () => {
        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/resume/ats-report`,
                {
                    jobDescription,
                    resume: selectedResume,
                },
                {
                    withCredentials: true,
                }
            );
            setReport(data?.data);
        } catch (e) {
            toast.error("Failed to analyze resume.");
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
            {report && (
                <div>
                    <div>
                        <h1>ATS Analysis Report</h1>
                        <div>
                            <h2>ATS Score: {report.atsScore}</h2>
                            <div>
                                <div>Interview Outlook:</div>{" "}
                                {report.recommendation.interviewRecommendation}
                            </div>
                            <div>
                                <div>Resume Feedback:</div>{" "}
                                {report.recommendation.resumeRecommendation}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3>Executive Summary</h3>
                        <div>{report.summary}</div>
                    </div>

                    <div>
                        <h3>Skills Analysis</h3>

                        <div>
                            <h4>Hard Skills Matched</h4>
                            <ul>
                                {report.skillsAnalysis.hardSkillsMatched.map(
                                    (skill, index) => (
                                        <li key={index}>{skill}</li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div>
                            <h4>Missing Skills (Gap Analysis)</h4>
                            <ul>
                                {report.skillsAnalysis.hardSkillsMissing.map(
                                    (skill, index) => (
                                        <li key={index}>{skill}</li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div>
                            <h4>Soft Skills Detected</h4>
                            <ul>
                                {report.skillsAnalysis.softSkillsFound.map(
                                    (skill, index) => (
                                        <li key={index}>{skill}</li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h3>Searchability Check</h3>
                        <ul>
                            <li>
                                Email:{" "}
                                {report.searchability.emailPresent
                                    ? "Detected"
                                    : "Missing"}
                            </li>
                            <li>
                                Phone:{" "}
                                {report.searchability.phonePresent
                                    ? "Detected"
                                    : "Missing"}
                            </li>
                            <li>
                                LinkedIn:{" "}
                                {report.searchability.linkedinPresent
                                    ? "Detected"
                                    : "Missing"}
                            </li>
                            <li>
                                Location:{" "}
                                {report.searchability.locationPresent
                                    ? "Detected"
                                    : "Missing"}
                            </li>
                            <li>
                                Job Title Match:{" "}
                                {report.searchability.jobTitleMatch
                                    ? "Yes"
                                    : "No"}
                            </li>
                            <li>
                                Name:{" "}
                                {report.searchability.namePresent
                                    ? "Detected"
                                    : "Missing"}
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3>Grammar & Formatting</h3>

                        <div>
                            <h4>Grammar Issues</h4>
                            <div>
                                Grammar Errors Found:{" "}
                                {report.grammerCheck.grammarIssuesFound
                                    ? "Yes"
                                    : "No"}
                            </div>
                            <div>
                                Spelling Errors Found:{" "}
                                {report.grammerCheck.spellingErrorsFound
                                    ? "Yes"
                                    : "No"}
                            </div>
                            <ul>
                                {report.grammerCheck.correctionsSuggested.map(
                                    (correction, index) => (
                                        <li key={index}>{correction}</li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div>
                            <h4>Formatting Feedback</h4>
                            <dl>
                                <dt>
                                    <div>Voice Usage:</div>
                                </dt>
                                <dd>
                                    {report.formattingCheck.usageOfActiveVoice}
                                </dd>

                                <dt>
                                    <div>Repetition Check:</div>
                                </dt>
                                <dd>
                                    {report.formattingCheck.repetitionCheck}
                                </dd>

                                <dt>
                                    <div>Casing Errors:</div>
                                </dt>
                                <dd>
                                    <ul>
                                        {report.formattingCheck.skillCasingErrors.map(
                                            (error, index) => (
                                                <li key={index}>{error}</li>
                                            )
                                        )}
                                    </ul>
                                </dd>
                            </dl>
                        </div>
                    </div>

                    <div>
                        <h3>Recruiter's Action Plan</h3>
                        <div>
                            <div>Measurable Results Found:</div>{" "}
                            {report.recruiterTips.measurableResultsFound
                                ? "Yes"
                                : "No - Needs Improvement"}
                        </div>

                        <h4>Improvement Suggestions</h4>
                        <ol>
                            {report.recruiterTips.improvementSuggestions.map(
                                (suggestion, index) => (
                                    <li key={index}>{suggestion}</li>
                                )
                            )}
                        </ol>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumePage;
