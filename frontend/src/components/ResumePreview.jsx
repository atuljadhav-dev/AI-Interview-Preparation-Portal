export default function ResumePreview({ resume }) {
    if (!resume) return null;

    return (
        <div className="w-full bg-gray-100 py-6 px-3 sm:px-6">
            <div className="max-w-4xl mx-auto bg-white text-gray-900 p-6 sm:p-10 font-sans">
                {/* Header */}
                <header className="border-b pb-4 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        {resume.name || "Candidate Name"}
                    </h1>

                    <p className="text-xs sm:text-sm mt-2 leading-relaxed">
                        {resume.contact?.location}
                        {resume.contact?.phone && ` • ${resume.contact.phone}`}
                        {resume.contact?.email && (
                            <>
                                {" "}
                                •{" "}
                                <a
                                    href={`mailto:${resume.contact.email}`}
                                    className="underline break-all">
                                    {resume.contact.email}
                                </a>
                            </>
                        )}
                    </p>

                    {Array.isArray(resume.links) && resume.links.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-2 text-xs sm:text-sm">
                            {resume.links.map((link, i) => (
                                <a
                                    key={i}
                                    href={link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="underline break-all">
                                    {link.replace("https://", "")}
                                </a>
                            ))}
                        </div>
                    )}
                </header>

                {/* Summary */}
                {resume.summary && (
                    <Section title="Professional Summary">
                        <p className="text-sm leading-relaxed">
                            {resume.summary}
                        </p>
                    </Section>
                )}

                {/* Skills (Universal) */}
                {Array.isArray(resume.skills) && resume.skills.length > 0 && (
                    <Section title="Skills">
                        {resume.skills.map((group, i) => (
                            <SkillRow
                                key={i}
                                title={group.category}
                                skills={group.items}
                            />
                        ))}
                    </Section>
                )}

                {/* Experience */}
                {Array.isArray(resume.experience) &&
                    resume.experience.length > 0 && (
                        <Section title="Experience">
                            {resume.experience.map((exp, i) => (
                                <div key={i} className="mb-5">
                                    <div className="flex flex-col sm:flex-row sm:justify-between font-medium text-sm">
                                        <span>
                                            {exp.title}
                                            {exp.company && ` — ${exp.company}`}
                                        </span>
                                        {exp.dates && (
                                            <span className="text-xs sm:text-sm text-gray-600">
                                                {exp.dates}
                                            </span>
                                        )}
                                    </div>

                                    {exp.location && (
                                        <p className="text-xs italic text-gray-600">
                                            {exp.location}
                                        </p>
                                    )}

                                    {Array.isArray(exp.responsibilities) && (
                                        <ul className="list-disc ml-5 mt-2 text-sm space-y-1">
                                            {exp.responsibilities.map(
                                                (r, idx) => (
                                                    <li key={idx}>{r}</li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </Section>
                    )}

                {/* Projects */}
                {Array.isArray(resume.projects) &&
                    resume.projects.length > 0 && (
                        <Section title="Projects / Case Studies">
                            {resume.projects.map((project, i) => (
                                <div key={i} className="mb-4">
                                    <p className="font-medium text-sm">
                                        {project.name}
                                    </p>
                                    {Array.isArray(project.description) && (
                                        <ul className="list-disc ml-5 text-sm mt-1 space-y-1">
                                            {project.description.map(
                                                (d, idx) => (
                                                    <li key={idx}>{d}</li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </Section>
                    )}

                {/* Education */}
                {Array.isArray(resume.education) &&
                    resume.education.length > 0 && (
                        <Section title="Education">
                            {resume.education.map((edu, i) => (
                                <div key={i} className="mb-3">
                                    <p className="font-medium text-sm">
                                        {edu.degree}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-700">
                                        {edu.institution}
                                        {edu.dates && ` • ${edu.dates}`}
                                    </p>
                                    {edu.details && (
                                        <p className="text-xs sm:text-sm">
                                            {edu.details}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </Section>
                    )}

                {/* Certifications */}
                {Array.isArray(resume.certifications) &&
                    resume.certifications.length > 0 && (
                        <Section title="Certifications">
                            <ul className="list-disc ml-5 text-sm space-y-1">
                                {resume.certifications.map((c, i) => (
                                    <li key={i}>{c}</li>
                                ))}
                            </ul>
                        </Section>
                    )}
            </div>
        </div>
    );
}

/* ---------- Helpers ---------- */

function Section({ title, children }) {
    return (
        <section className="mb-6">
            <h2 className="text-base sm:text-lg font-semibold border-b mb-2">
                {title}
            </h2>
            {children}
        </section>
    );
}

function SkillRow({ title, skills }) {
    if (!Array.isArray(skills) || skills.length === 0) return null;
    return (
        <div className="mb-2 text-sm leading-relaxed">
            <span className="font-medium">{title}:</span> {skills.join(" · ")}
        </div>
    );
}
