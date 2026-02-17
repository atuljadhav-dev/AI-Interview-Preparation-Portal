import Link from "next/link";
import React from "react";

const ATSCard = ({ data }) => {
    return (
        <div>
            <Link href={`/resume/ats-report/${data._id}`}>{data.title}</Link>
        </div>
    );
};

export default ATSCard;
