import FeedBack from "@/app/(pages)/feedback/[id]/FeedBackPage";
import axios from "axios";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

export const generateMetadata = async ({ params }) => {
    const { id } = await params;
    const cookieStore = await cookies(); // Access cookies
    const token = cookieStore.get("authToken")?.value; // Get the authToken cookie value
    try {
        const res = await axios.get(
            `${process.env.BASE_URL}/interview/specific/${id}`,
            {
                headers: {
                    Cookie: `authToken=${token}`, // Include the authToken cookie in the request
                },
                withCredentials: true,
            }
        );

        const interview = res.data.data;
        return {
            title: `Feedback for ${interview.title} Interview | PlacementReady`,
            description: `Detailed feedback for your ${interview.roundName} interview session.`,
            openGraph: {
                title: `Feedback for ${interview.title} Interview`,
                description: `Comprehensive feedback on your performance in the ${interview.roundName} interview.`,
            },
        };
    } catch (error) {
        return {
            title: "Interview Feedback | PlacementReady",
        };
    }
};

const page = async ({ params }) => {
    const { id } = await params;
    return (
        <Suspense fallback={<div className="animate-pulse">loading ....</div>}>
            <FeedBack id={id} />
        </Suspense>
    );
};

export default page;
