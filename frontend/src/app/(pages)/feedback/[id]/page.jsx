import FeedBack from "@/app/(pages)/feedback/[id]/FeedBackPage";
import api from "@/utils/api";
import React, { Suspense } from "react";

export const generateMetadata = async ({ params }) => {
    const { id } = await params;
    try {
        const res = await api.get(`/feedback/${id}`)

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
