import { Suspense } from "react";
import TestPage from "./TestPage";

const page = async ({ params }) => {
    const { id } = await params;
    return (
        <Suspense fallback={<div className="animate-pulse">loading ....</div>}>
            <TestPage id={id} />
        </Suspense>
    );
};
export default page;
