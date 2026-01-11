import PdfViewer from "@/components/PdfViewer";
import React from "react";

const page = async ({ params }) => {
    const { id } = await params;

    return (
        <>
            <PdfViewer id={id} />
        </>
    );
};

export default page;
