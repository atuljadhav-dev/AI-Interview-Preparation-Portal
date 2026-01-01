import CreateInterview from "@/components/CreateInterview";

export const metadata = {
    title: "Create Interview - PlacementReady",
    description:
        "Create a new interview session on PlacementReady. Input job role, description, and select your resume to start practicing for your interviews.",
};

const page = () => {
    return (
        <>
            <CreateInterview />
        </>
    );
};

export default page;
