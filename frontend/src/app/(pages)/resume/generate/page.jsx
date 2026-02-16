import { Suspense } from "react";
import ResumePage from "./ResumeGeneratePage";

const page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResumePage />
        </Suspense>
    );
};

export default page;
