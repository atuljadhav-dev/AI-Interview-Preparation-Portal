"use client";
import Link from "next/link";
import React, { useRef } from "react";
const ResumePreview = ({ resume }) => {
    const resumeRef = useRef(null);
    const handleDownloadPDF = async () => {
        // console.log("Preparing to generate PDF for resume:", resume);
        const element = resumeRef.current;
        const html2pdf = (await import("html2pdf.js")).default;
        const opt = {
            margin: 5,
            filename: `${resume.name || "Resume"}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 1.5, useCORS: true, letterRendering: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            pagebreak: { mode: ["css", "legacy"] },
        };
        console.log("Generating PDF with options:", opt);

        html2pdf().set(opt).from(element).save();
    };
    if (!resume) return null;

    return (
        <div className="py-10 min-h-screen">
            <div className="flex justify-center mb-6">
                <button
                    onClick={handleDownloadPDF}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-md font-semibold">
                    Download PDF
                </button>
            </div>
            <div
                ref={resumeRef}
                style={{
                    color: "#1a202c",
                    backgroundColor: "#fff",
                }}
                className="w-[200mm] min-h-[297mm] p-[5mm] mx-auto  shadow-lg font-poppins leading-normal transition-colors">
                <header className="mb-4">
                    <h1
                        style={{
                            color: "#1a202c",
                        }}
                        className="text-[22pt] font-bold m-0 leading-tight">
                        {resume.name || "Candidate Name"}
                    </h1>
                    <div
                        style={{
                            color: "#4a5568",
                        }}
                        className="text-[9pt]  mt-1.5 flex flex-wrap gap-2">
                        {[
                            resume.contact?.location,
                            resume.contact?.phone,
                            resume.contact?.email && (
                                <Link
                                    key="email"
                                    href={`mailto:${resume.contact.email}`}
                                    className="underline text-inherit transition-colors">
                                    {resume.contact.email}
                                </Link>
                            ),
                            resume.links?.linkedin && (
                                <Link
                                    key="li"
                                    href={resume.links.linkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="no-underline text-inherit  transition-colors">
                                    LinkedIn
                                </Link>
                            ),
                            resume.links?.github && (
                                <Link
                                    key="gh"
                                    href={resume.links.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="no-underline text-inherit  transition-colors">
                                    GitHub
                                </Link>
                            ),
                            resume.links?.portfolio && (
                                <Link
                                    key="port"
                                    href={resume.links.portfolio}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="no-underline text-inherit  transition-colors">
                                    Portfolio
                                </Link>
                            ),
                        ]
                            .filter(Boolean)
                            .reduce(
                                (prev, curr, i) =>
                                    i === 0 ? [curr] : [...prev, " • ", curr],
                                []
                            )}
                    </div>
                </header>

                {resume.summary && (
                    <section className="mb-3">
                        <h2
                            style={{
                                color: "#1a202c",
                                borderColor: "#e2e8f0",
                            }}
                            className="text-[11pt] font-bold uppercase border-b  mb-1.5 mt-3  tracking-wider">
                            Professional Summary
                        </h2>
                        <p
                            style={{
                                color: "#4a5568",
                            }}
                            className="text-[10pt] ">
                            {resume.summary}
                        </p>
                    </section>
                )}

                {resume.skills && (
                    <section className="mb-3">
                        <h2
                            style={{
                                color: "#1a202c",
                                borderColor: "#e2e8f0",
                            }}
                            className="text-[11pt] font-bold uppercase border-b  mb-1.5 mt-3  tracking-wider">
                            Skills
                        </h2>
                        {Array.isArray(resume.skills)
                            ? resume.skills.map((group, i) => (
                                  <div
                                      key={i}
                                      style={{
                                          color: "#4a5568",
                                      }}
                                      className="text-[10pt  mb-1">
                                      <strong
                                          style={{
                                              color: "#1a202c",
                                          }}
                                          className="font-semibold ">
                                          {group.category}:
                                      </strong>{" "}
                                      {group.items?.join(" · ")}
                                  </div>
                              ))
                            : Object.entries(resume.skills).map(
                                  ([key, val]) => (
                                      <div
                                          key={key}
                                          style={{
                                              color: "#4a5568",
                                          }}
                                          className="text-[10pt]  mb-1">
                                          <strong
                                              style={{
                                                  color: "#1a202c",
                                              }}
                                              className="font-semibold capitalize">
                                              {key}:
                                          </strong>{" "}
                                          {val.join(" · ")}
                                      </div>
                                  )
                              )}
                    </section>
                )}

                {resume.experience?.length > 0 && (
                    <section className="mb-3">
                        <h2
                            style={{
                                color: "#1a202c",
                                borderColor: "#e2e8f0",
                            }}
                            className="text-[11pt] font-bold uppercase border-b mb-1.5 mt-3  tracking-wider">
                            Experience
                        </h2>
                        {resume.experience.map((exp, i) => (
                            <div
                                key={i}
                                className="mb-2.5"
                                style={{
                                    pageBreakInside: "avoid", // Prevents breaking inside this element
                                    breakInside: "avoid", // For better browser support
                                }}>
                                <div className="flex justify-between font-semibold text-[10pt]">
                                    <span
                                        style={{
                                            color: "#1a202c",
                                        }}
                                        className="">
                                        {exp.title}
                                        {exp.company && ` — ${exp.company}`}
                                    </span>
                                    <span
                                        style={{
                                            color: "#4a5568",
                                        }}
                                        className="font-normal ">
                                        {exp.dates}
                                    </span>
                                </div>
                                {exp.location && (
                                    <div
                                        style={{
                                            color: "#4a5568",
                                        }}
                                        className="text-[9pt] italic ">
                                        {exp.location}
                                    </div>
                                )}
                                <ul
                                    style={{
                                        color: "#4a5568",
                                    }}
                                    className="text-[10pt]  pl-4 mt-1 mb-2 list-disc">
                                    {exp.responsibilities?.map((r, idx) => (
                                        <li key={idx} className="mb-0.5">
                                            {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>
                )}

                {resume.projects?.length > 0 && (
                    <section className="mb-3">
                        <h2
                            style={{
                                color: "#1a202c",
                                borderColor: "#e2e8f0",
                            }}
                            className="text-[11pt] font-bold uppercase border-b mb-1.5 mt-3  tracking-wider">
                            Key Projects
                        </h2>
                        {resume.projects.map((project, i) => (
                            <div
                                key={i}
                                className="mb-2"
                                style={{
                                    pageBreakInside: "avoid",
                                    breakInside: "avoid",
                                    display: "block", // Ensures the property is respected
                                }}>
                                <div
                                    style={{
                                        color: "#1a202c",
                                    }}
                                    className="font-semibold text-[10pt] flex items-center gap-2">
                                    {/* Project Name */}
                                    <span>{project.name}</span>

                                    {/* Project Links - now displayed inline next to the title */}
                                    {project.links && (
                                        <span
                                            style={{
                                                color: "#4a5568",
                                            }}
                                            className="text-[9pt] italic inline-flex flex-wrap gap-2">
                                            {project.links.github && (
                                                <Link
                                                    href={project.links.github}
                                                    target="_blank"
                                                    className=" text-inherit  transition-colors">
                                                    GitHub
                                                </Link>
                                            )}

                                            {project.links.live && (
                                                <Link
                                                    href={project.links.live}
                                                    target="_blank"
                                                    className=" text-inherit  transition-colors">
                                                    Live
                                                </Link>
                                            )}
                                            {project.links.others &&
                                                project.links.others.map(
                                                    (link, idx) => (
                                                        <Link
                                                            key={idx}
                                                            href={link.url}
                                                            target="_blank"
                                                            className=" text-inherit  transition-colors">
                                                            {link.label ||
                                                                `Link ${
                                                                    idx + 1
                                                                }`}
                                                        </Link>
                                                    )
                                                )}
                                        </span>
                                    )}
                                </div>

                                {project.technologies && (
                                    <div
                                        style={{
                                            color: "#4a5568",
                                        }}
                                        className="text-[9pt] italic">
                                        Tech: {project.technologies.join(" · ")}
                                    </div>
                                )}
                                <ul
                                    style={{
                                        color: "#4a5568",
                                    }}
                                    className="text-[10pt]  pl-4 mt-1 mb-2 list-disc">
                                    {project.description?.map((d, idx) => (
                                        <li key={idx} className="mb-0.5">
                                            {d}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>
                )}
                {resume.education?.length > 0 && (
                    <section className="mb-3">
                        <h2
                            style={{
                                color: "#1a202c",
                                borderColor: "#e2e8f0",
                            }}
                            className="text-[11pt] font-bold uppercase border-b mb-1.5 mt-3  tracking-wider">
                            Education
                        </h2>
                        {resume.education.map((edu, i) => (
                            <div
                                key={i}
                                className="mb-2"
                                style={{
                                    pageBreakInside: "avoid",
                                    breakInside: "avoid",
                                }}>
                                <div
                                    style={{
                                        color: "#1a202c",
                                    }}
                                    className="flex justify-between font-semibold text-[10pt]">
                                    <span>{edu.degree}</span>
                                    <span
                                        style={{
                                            color: "#4a5568",
                                        }}
                                        className="font-normal">
                                        {edu.dates}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        color: "#4a5568",
                                    }}
                                    className="text-[10pt]">
                                    {edu.institution}{" "}
                                    {edu.details && `• ${edu.details}`}
                                </div>
                            </div>
                        ))}
                    </section>
                )}
                {resume.certifications?.length > 0 && (
                    <section className="mb-3">
                        <h2
                            style={{
                                color: "#1a202c",
                                borderColor: "#e2e8f0",
                            }}
                            className="text-[11pt] font-bold uppercase border-b mb-1.5 mt-3  tracking-wider">
                            Certifications
                        </h2>
                        <ul
                            style={{
                                color: "#4a5568",
                            }}
                            className="text-[10pt]  pl-4 mt-1 mb-2 list-disc">
                            {resume.certifications.map((c, i) => (
                                <li key={i}>{c}</li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ResumePreview;
