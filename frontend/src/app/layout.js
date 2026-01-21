import { Poppins } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { Providers } from "@/components/Providers";

const geistPoppins = Poppins({
    variable: "--font-geist-poppins", // Define a CSS variable for the font
    subsets: ["latin"], // Specify the character subsets you need
    weight: ["400", "500", "600", "700", "800"], // Add weights as needed
});
// metadata for the PlacementReady  help to improve SEO and provide essential information about the website.
export const metadata = {
    title: "PlacementReady | AI Interview Preparation Portal",
    description:
        "Master your job interviews with PlacementReady. An AI-powered platform offering realistic mock interviews, instant personalized feedback, resume analysis, and progress tracking to help you land your dream job.",
    keywords: [
        "AI interview preparation",
        "mock interview",
        "interview practice",
        "placement ready",
        "AI interviewer",
        "technical interview",
        "HR round preparation",
        "resume parser",
        "job interview feedback",
        "PlacementReady",
        "interview coaching",
        "career preparation",
        "job readiness",
        "interview skills",
        "communication skills",
        "confidence building",
        "job search tools",
        "career development",
        "interview tips",
        "resume building",
        "job interview simulator",
        "interview assessment",
        "AI career coach",
        "interview scoring",
        "personalized feedback",
        "interview analytics",
        "placement ready vercel",
        "job interview platform",
        "placement ready ai",
        "placementready",
        "placement ready app",
        "placement ready interview",
        "placement ready dashboard",
    ],
    authors: [{ name: "PlacementReady Team" }],
    openGraph: {
        title: "PlacementReady - Ace Your Interviews with AI",
        description:
            "Practice with realistic AI-driven mock interviews, receive instant scores (1-10) and detailed feedback to improve your confidence and communication skills.",
        url: "https://placementready.vercel.app",
        siteName: "PlacementReady",
        images: [
            {
                url: "/logo.png",
                width: 1200,
                height: 630,
                alt: "AI Interview Preparation Portal Dashboard",
            },
        ],
        locale: "en-IN",
        type: "website",
    },
    icons: {
        icon: "/icon.png",
        shortcut: "/logo1.png",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            {/* suppressHydrationWarning to prevent hydration mismatch warnings */}
            <body className={`${geistPoppins.variable} antialiased`}>
                <ToastContainer />
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
