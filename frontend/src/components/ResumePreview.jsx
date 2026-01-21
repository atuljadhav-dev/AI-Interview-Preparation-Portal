"use client";
import React, { useRef, useState, useLayoutEffect } from "react";
import html2pdf from "html2pdf.js";

export default function ResumePreview({ resume }) {
    const resumeRef = useRef();

    // Scaling States
    const [fontSizeFactor, setFontSizeFactor] = useState(1.0);
    const [isCalculating, setIsCalculating] = useState(true);

    // Constants
    const A4_HEIGHT_PX = 1122; // A4 height at 96 DPI
    const MIN_FACTOR = 0.75; // Minimum scaling (e.g., 10pt -> 7.5pt)

    /**
     * AUTO-SCALING LOGIC
     * Runs every time the fontSizeFactor changes or resume data updates.
     */
    useLayoutEffect(() => {
        if (!resumeRef.current) return;

        const adjustSize = () => {
            const currentHeight = resumeRef.current.offsetHeight;

            // If taller than 1 page and we haven't reached the minimum font size
            if (currentHeight > A4_HEIGHT_PX && fontSizeFactor > MIN_FACTOR) {
                // Reduce font size by 2% increments for smooth fitting
                setFontSizeFactor((prev) => Math.max(MIN_FACTOR, prev - 0.02));
            } else {
                // Stop calculating once it fits OR hits the floor
                setIsCalculating(false);
            }
        };

        const timeout = setTimeout(adjustSize, 30);
        return () => clearTimeout(timeout);
    }, [fontSizeFactor, resume]);

    if (!resume) return null;

    const handleDownload = () => {
        const element = resumeRef.current;
        const opt = {
            margin: 0,
            filename: `${resume.name?.replace(/\s+/g, "_") || "Resume"}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 3, useCORS: true, letterRendering: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        };

        html2pdf().set(opt).from(element).save();
    };

    // Helper function to scale font sizes
    const getFs = (base) => `${base * fontSizeFactor}pt`;
    const styles = {
        outerContainer: {
            backgroundColor: "#f7fafc",
            padding: "40px 0",
            minHeight: "100vh",
        },
        page: {
            width: "210mm",
            minHeight: "297mm",
            padding: "15mm",
            margin: "0 auto",
            backgroundColor: "white",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',
            color: "#1a202c",
            lineHeight: "1.4",
            visibility: isCalculating ? "hidden" : "visible",
            position: "relative",
        },
        name: {
            fontSize: getFs(22),
            fontWeight: "700",
            margin: "0",
            color: "#000",
            lineHeight: "1.1",
        },
        contactRow: {
            fontSize: getFs(9),
            color: "#4a5568",
            marginTop: "6px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
        },
        sectionTitle: {
            fontSize: getFs(11),
            fontWeight: "700",
            textTransform: "uppercase",
            borderBottom: "1px solid #e2e8f0",
            marginBottom: "6px",
            marginTop: "12px",
            color: "#2d3748",
            letterSpacing: "0.5px",
        },
        bodyText: {
            fontSize: getFs(10),
            color: "#2d3748",
        },
        boldText: {
            fontWeight: "600",
            fontSize: getFs(10),
        },
        list: {
            paddingLeft: "16px",
            marginTop: "4px",
            marginBottom: "8px",
        },
        listItem: {
            marginBottom: "2px",
        },
    };

    return (
        <div style={styles.outerContainer}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <button
                    onClick={handleDownload}
                    disabled={isCalculating}
                    style={{
                        padding: "12px 24px",
                        backgroundColor: isCalculating ? "#cbd5e0" : "#3182ce",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: isCalculating ? "not-allowed" : "pointer",
                        fontWeight: "600",
                        transition: "background 0.2s",
                    }}>
                    {isCalculating ? "Optimizing Layout..." : "Download PDF"}
                </button>
            </div>
            <div style={styles.page} ref={resumeRef}>
                {/* Header */}
                <header style={styles.header}>
                    <h1 style={styles.name}>
                        {resume.name || "Candidate Name"}
                    </h1>
                    <div style={styles.contactRow}>
                        {[
                            resume.contact?.location,
                            resume.contact?.phone,
                            resume.contact?.email && (
                                <a
                                    key="email"
                                    href={`mailto:${resume.contact.email}`}
                                    style={{
                                        textDecoration: "underline",
                                        color: "inherit",
                                    }}>
                                    {resume.contact.email}
                                </a>
                            ),
                            resume.links?.linkedin && (
                                <a
                                    key="li"
                                    href={resume.links.linkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}>
                                    LinkedIn
                                </a>
                            ),
                            resume.links?.github && (
                                <a
                                    key="gh"
                                    href={resume.links.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}>
                                    GitHub
                                </a>
                            ),
                            resume.links?.portfolio && (
                                <a
                                    key="port"
                                    href={resume.links.portfolio}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}>
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

                {/* Summary */}
                {resume.summary && (
                    <section>
                        <h2 style={styles.sectionTitle}>
                            Professional Summary
                        </h2>
                        <p style={styles.bodyText}>{resume.summary}</p>
                    </section>
                )}

                {/* Skills */}
                {resume.skills && (
                    <section>
                        <h2 style={styles.sectionTitle}>Skills</h2>
                        {/* Handles both Array and Object formats of skills */}
                        {Array.isArray(resume.skills)
                            ? resume.skills.map((group, i) => (
                                  <div
                                      key={i}
                                      style={{
                                          ...styles.bodyText,
                                          marginBottom: "3px",
                                      }}>
                                      <strong style={styles.boldText}>
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
                                              ...styles.bodyText,
                                              marginBottom: "3px",
                                          }}>
                                          <strong
                                              style={{
                                                  ...styles.boldText,
                                                  textTransform: "capitalize",
                                              }}>
                                              {key}:
                                          </strong>{" "}
                                          {val.join(" · ")}
                                      </div>
                                  )
                              )}
                    </section>
                )}

                {/* Experience */}
                {resume.experience?.length > 0 && (
                    <section>
                        <h2 style={styles.sectionTitle}>Experience</h2>
                        {resume.experience.map((exp, i) => (
                            <div key={i} style={{ marginBottom: "10px" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        ...styles.boldText,
                                    }}>
                                    <span>
                                        {exp.title}
                                        {exp.company && ` — ${exp.company}`}
                                    </span>
                                    <span
                                        style={{
                                            fontWeight: "400",
                                            color: "#718096",
                                        }}>
                                        {exp.dates}
                                    </span>
                                </div>
                                {exp.location && (
                                    <div
                                        style={{
                                            fontSize: "9pt",
                                            fontStyle: "italic",
                                            color: "#718096",
                                        }}>
                                        {exp.location}
                                    </div>
                                )}
                                <ul
                                    style={{
                                        ...styles.bodyText,
                                        ...styles.list,
                                    }}>
                                    {exp.responsibilities?.map((r, idx) => (
                                        <li key={idx} style={styles.listItem}>
                                            {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>
                )}

                {/* Projects */}
                {resume.projects?.length > 0 && (
                    <section>
                        <h2 style={styles.sectionTitle}>Key Projects</h2>
                        {resume.projects.map((project, i) => (
                            <div key={i} style={{ marginBottom: "8px" }}>
                                <div style={styles.boldText}>
                                    {project.name}
                                </div>
                                <ul
                                    style={{
                                        ...styles.bodyText,
                                        ...styles.list,
                                    }}>
                                    {project.description?.map((d, idx) => (
                                        <li
                                            key={idx}
                                            style={{ marginBottom: "2px" }}>
                                            {d}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>
                )}

                {/* Education */}
                {resume.education?.length > 0 && (
                    <section>
                        <h2 style={styles.sectionTitle}>Education</h2>
                        {resume.education.map((edu, i) => (
                            <div key={i} style={{ marginBottom: "8px" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontWeight: "600",
                                        fontSize: "10pt",
                                    }}>
                                    <span>{edu.degree}</span>
                                    <span
                                        style={{
                                            fontWeight: "400",
                                            color: "#718096",
                                        }}>
                                        {edu.dates}
                                    </span>
                                </div>
                                <div style={styles.bodyText}>
                                    {edu.institution}{" "}
                                    {edu.details && `• ${edu.details}`}
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* Certifications */}
                {resume.certifications?.length > 0 && (
                    <section>
                        <h2 style={styles.sectionTitle}>Certifications</h2>
                        <ul style={{ ...styles.bodyText, ...styles.list }}>
                            {resume.certifications.map((c, i) => (
                                <li key={i}>{c}</li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </div>
    );
}
