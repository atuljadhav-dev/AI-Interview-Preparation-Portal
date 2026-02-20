import React from "react";
import ReportPage from "./ReportPage";

const page = async ({ params }) => {
    const { id } = await params;
    return (
        <div>
            <ReportPage id={id} />
        </div>
    );
};

export default page;
