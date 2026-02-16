import React from "react";
import ReportPage from "./ReportPage";

const page = ({ params }) => {
    const { id } = params;
    return (
        <div>
            <ReportPage id={id} />
        </div>
    );
};

export default page;
