import { Poppins } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { Providers } from "@/components/Providers";

const poppins = Poppins({
    variable: "--font-poppins", // Define a CSS variable for the Poppins font
    subsets: ["latin"], // Specify the character subsets to include (Latin characters in this case)
    weight: ["400", "500", "600", "700", "800"], // Add the desired font weights for the Poppins font
    display: "swap",
});

const siteUrl = "https://placementready.atuljadhav.tech";
// metadata for the PlacementReady  help to improve SEO and provide essential information about the website.
export const metadata = {
    metadataBase: new URL(siteUrl),

    title: {
        default: "PlacementReady | AI Interview Preparation Portal",
        template: "%s | PlacementReady",
    },

    description:
        "PlacementReady is an AI-powered interview preparation portal that helps students and job seekers practice mock interviews, analyze resumes, improve interview performance, and prepare for technical and HR rounds.",

    keywords: [
        "AI interview preparation",
        "AI mock interview",
        "interview preparation",
        "technical interview preparation",
        "HR interview preparation",
        "mock interview",
        "resume analyzer",
        "ATS resume checker",
        "resume optimization",
        "interview feedback",
        "interview practice",
        "coding interview preparation",
        "job interview simulator",
        "career preparation",
        "PlacementReady",
    ],

    authors: [
        {
            name: "Atul Mohan Jadhav",
            url: "https://atuljadhav.tech",
        },
    ],

    creator: "Atul Mohan Jadhav",

    publisher: "PlacementReady",

    alternates: {
        canonical: "/",
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    openGraph: {
        type: "website",
        locale: "en_IN",
        url: siteUrl,
        siteName: "PlacementReady",
        title: "PlacementReady | AI Interview Preparation Portal",
        description:
            "Practice AI-powered mock interviews, analyze your resume, receive personalized feedback, and improve your interview skills with PlacementReady.",
        images: [
            {
                url: "/logo.png",
                width: 1200,
                height: 630,
                alt: "PlacementReady AI Interview Preparation Portal",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "PlacementReady | AI Interview Preparation Portal",
        description:
            "Prepare for technical and HR interviews with AI-powered mock interviews, resume analysis, and personalized feedback.",
        images: ["/logo.png"],
    },

    icons: {
        icon: "/icon.png",
        shortcut: "/logo.png",
        apple: "/logo.png",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
			 {/* suppressHydrationWarning to prevent hydration mismatch warnings */}
            <body className={`${poppins.variable} antialiased`}>
                <ToastContainer />
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}