import ResumePreview from "@/components/ResumePreview";
import React from "react";

export const metadata = {
    title: "Dashboard - PlacementReady",
    description:
        "Your personalized dashboard on PlacementReady. Access your interview preparations, resume building tools, and career resources all in one place.",
};

const page = () => {
    const mlResume = {
        name: "Rohit Sharma",
        contact: {
            email: "rohit.ml@gmail.com",
            location: "Pune, India",
        },
        summary:
            "Machine Learning student with strong foundation in data analysis, model building, and applied AI projects.",
        skills: [
            {
                category: "Programming",
                items: ["Python", "SQL"],
            },
            {
                category: "Machine Learning",
                items: [
                    "Linear Regression",
                    "Decision Trees",
                    "Neural Networks",
                ],
            },
            {
                category: "Tools",
                items: ["Pandas", "NumPy", "TensorFlow", "Jupyter"],
            },
        ],
        projects: [
            {
                name: "House Price Prediction",
                description: [
                    "Built regression model with scikit-learn",
                    "Performed feature engineering and evaluation",
                ],
            },
        ],
        education: [
            {
                degree: "B.Tech in Artificial Intelligence",
                institution: "XYZ University",
                dates: "2022 – 2026",
            },
        ],
    };
    const mbaResume = {
        name: "Sneha Kulkarni",
        contact: {
            email: "sneha.mba@gmail.com",
            location: "Mumbai, India",
        },
        summary:
            "MBA student specializing in Finance and Operations with strong analytical and leadership skills.",
        skills: [
            {
                category: "Core Business Skills",
                items: [
                    "Financial Analysis",
                    "Operations Management",
                    "Strategic Planning",
                ],
            },
            {
                category: "Tools",
                items: ["Excel", "Power BI", "SAP"],
            },
            {
                category: "Soft Skills",
                items: ["Leadership", "Communication", "Decision Making"],
            },
        ],
        projects: [
            {
                name: "Market Entry Strategy",
                description: [
                    "Conducted competitor analysis",
                    "Proposed go-to-market strategy",
                ],
            },
        ],
        education: [
            {
                degree: "MBA – Finance & Operations",
                institution: "ABC Business School",
                dates: "2023 – 2025",
            },
        ],
    };
    const hrResume = {
        name: "Anjali Deshmukh",
        contact: {
            email: "anjali.hr@gmail.com",
            location: "Nagpur, India",
        },
        summary:
            "HR professional with experience in recruitment, employee engagement, and HR operations.",
        skills: [
            {
                category: "HR Skills",
                items: ["Talent Acquisition", "Employee Engagement", "Payroll"],
            },
            {
                category: "Tools",
                items: ["ATS Systems", "MS Excel"],
            },
            {
                category: "Soft Skills",
                items: ["Communication", "Conflict Resolution"],
            },
        ],
        experience: [
            {
                title: "HR Executive",
                company: "PeopleFirst Pvt Ltd",
                dates: "2024 – Present",
                responsibilities: [
                    "Managed end-to-end recruitment",
                    "Conducted onboarding sessions",
                ],
            },
        ],
        education: [
            {
                degree: "BBA – Human Resources",
                institution: "DEF University",
                dates: "2021 – 2024",
            },
        ],
    };

    return (
        <div>
            <ResumePreview resume={mlResume} />
            <ResumePreview resume={mbaResume} />
            <ResumePreview resume={hrResume} />
        </div>
    );
};

export default page;
