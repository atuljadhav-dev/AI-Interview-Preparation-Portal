import React from "react";

export default function EmailPreview({ data }) {
    return (
        <div>
            <div>
                <span>Subject:</span>
                {data.subject}
            </div>
            <div>
                <p>{data.greeting}</p>

                {data.body_paragraphs.map((para, index) => (
                    <p key={index}>{para}</p>
                ))}

                <div>
                    <p>{data.closing}</p>
                    <p>{data.signature_hint}</p>
                </div>
            </div>
        </div>
    );
}
