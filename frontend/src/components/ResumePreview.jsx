"use client";
import React from "react";
const ResumePreview = ({ resume }) => {
    if (!resume) return null;

    return (
        <div className="py-10 min-h-screen">
            <div className="w-[210mm] min-h-[297mm] p-[15mm] mx-auto bg-white  text-gray-900  shadow-lg font-poppins leading-normal transition-colors">
                <header className="mb-4">
                    <h1 className="text-[22pt] font-bold m-0 text-black  leading-tight">
                        {resume.name || "Candidate Name"}
                    </h1>
                    <div className="text-[9pt] text-gray-600  mt-1.5 flex flex-wrap gap-2">
                        {[
                            resume.contact?.location,
                            resume.contact?.phone,
                            resume.contact?.email && (
                                <a
                                    key="email"
                                    href={`mailto:${resume.contact.email}`}
                                    className="underline text-inherit hover:text-purple-500 transition-colors">
                                    {resume.contact.email}
                                </a>
                            ),
                            resume.links?.linkedin && (
                                <a
                                    key="li"
                                    href={resume.links.linkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="no-underline text-inherit hover:text-purple-500 transition-colors">
                                    LinkedIn
                                </a>
                            ),
                            resume.links?.github && (
                                <a
                                    key="gh"
                                    href={resume.links.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="no-underline text-inherit hover:text-purple-500 transition-colors">
                                    GitHub
                                </a>
                            ),
                            resume.links?.portfolio && (
                                <a
                                    key="port"
                                    href={resume.links.portfolio}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="no-underline text-inherit hover:text-purple-500 transition-colors">
                                    Portfolio
                                </a>
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
                        <h2 className="text-[11pt] font-bold uppercase border-b border-gray-200 mb-1.5 mt-3 text-gray-800  tracking-wider">
                            Professional Summary
                        </h2>
                        <p className="text-[10pt] text-gray-700 ">
                            {resume.summary}
                        </p>
                    </section>
                )}

                {resume.skills && (
                    <section className="mb-3">
                        <h2 className="text-[11pt] font-bold uppercase border-b border-gray-200 mb-1.5 mt-3 text-gray-800  tracking-wider">
                            Skills
                        </h2>
                        {Array.isArray(resume.skills)
                            ? resume.skills.map((group, i) => (
                                  <div
                                      key={i}
                                      className="text-[10pt] text-gray-700  mb-1">
                                      <strong className="font-semibold text-gray-900 ">
                                          {group.category}:
                                      </strong>{" "}
                                      {group.items?.join(" · ")}
                                  </div>
                              ))
                            : Object.entries(resume.skills).map(
                                  ([key, val]) => (
                                      <div
                                          key={key}
                                          className="text-[10pt] text-gray-700  mb-1">
                                          <strong className="font-semibold text-gray-900  capitalize">
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
                        <h2 className="text-[11pt] font-bold uppercase border-b border-gray-200 mb-1.5 mt-3 text-gray-800  tracking-wider">
                            Experience
                        </h2>
                        {resume.experience.map((exp, i) => (
                            <div key={i} className="mb-2.5">
                                <div className="flex justify-between font-semibold text-[10pt]">
                                    <span className="text-gray-900 ">
                                        {exp.title}
                                        {exp.company && ` — ${exp.company}`}
                                    </span>
                                    <span className="font-normal text-gray-500 ">
                                        {exp.dates}
                                    </span>
                                </div>
                                {exp.location && (
                                    <div className="text-[9pt] italic text-gray-500 ">
                                        {exp.location}
                                    </div>
                                )}
                                <ul className="text-[10pt] text-gray-700  pl-4 mt-1 mb-2 list-disc">
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
                        <h2 className="text-[11pt] font-bold uppercase border-b border-gray-200 mb-1.5 mt-3 text-gray-800  tracking-wider">
                            Key Projects
                        </h2>
                        {resume.projects.map((project, i) => (
                            <div key={i} className="mb-2">
                                <div className="font-semibold text-[10pt] text-gray-900 ">
                                    {project.name}
                                </div>
                                <ul className="text-[10pt] text-gray-700  pl-4 mt-1 mb-2 list-disc">
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
                        <h2 className="text-[11pt] font-bold uppercase border-b border-gray-200 mb-1.5 mt-3 text-gray-800  tracking-wider">
                            Education
                        </h2>
                        {resume.education.map((edu, i) => (
                            <div key={i} className="mb-2">
                                <div className="flex justify-between font-semibold text-[10pt] text-gray-900 ">
                                    <span>{edu.degree}</span>
                                    <span className="font-normal text-gray-500 ">
                                        {edu.dates}
                                    </span>
                                </div>
                                <div className="text-[10pt] text-gray-700 ">
                                    {edu.institution}{" "}
                                    {edu.details && `• ${edu.details}`}
                                </div>
                            </div>
                        ))}
                    </section>
                )}
                {resume.certifications?.length > 0 && (
                    <section className="mb-3">
                        <h2 className="text-[11pt] font-bold uppercase border-b border-gray-200 mb-1.5 mt-3 text-gray-800  tracking-wider">
                            Certifications
                        </h2>
                        <ul className="text-[10pt] text-gray-700  pl-4 mt-1 mb-2 list-disc">
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