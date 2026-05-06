import { Suspense } from "react";
import ResultPage from "./ResultPage";

const page = async ({ params }) => {
    const { id } = await params;
    return (
        <Suspense fallback={<div className="animate-pulse">loading ....</div>}>
            <ResultPage id={id} />
        </Suspense>
    );
};
export default page;
