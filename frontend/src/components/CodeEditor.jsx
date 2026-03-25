"use client";

import api from "@/utils/api";
import { useState } from "react";

const CodeEditor = () => {
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [language, setLanguage] = useState({
        name: "",
        placeholder: "",
    });
    const [error, setError] = useState(null);
    const [stdin, setStdin] = useState("");
    const languages = [
        {
            name: "javascript",
            placeholder: "//Write code here",
        },
        {
            name: "python",
            placeholder: "# Write code here",
        },
        {
            name: "cpp",
            placeholder: "// Write code here",
        },
        {
            name: "java",
            placeholder: "// Write code here",
        },
        {
            name: "c",
            placeholder: "// Write code here",
        },
        {
            name: "ruby",
            placeholder: "# Write code here",
        },
    ];

    const handleRunCode = async () => {
        if (language.name == "") {
            setError("select language");
            return;
        }
        setError(null);
        setOutput("");

        try {
            const { data } = await api.post("/code/execute", {
                language: language.name,
                stdin: stdin,
                code: code,
            });
            if (data.data.stderr) {
                setError(data.data.stderr);
            } else {
                setOutput(
                    data.data.stdout || "Execution completed with no output."
                );
            }
        } catch (e) {
            console.error("API Error:", e.response?.data || e.message);
            setError("Failed to connect to the execution server.");
        }
    };

    return (
        <>
            <textarea
                rows={10}
                cols={100}
                placeholder={language?.placeholder}
                value={code}
                onChange={(e) => {
                    setCode(e.target.value);
                }}
            />
            <textarea
                rows={5}
                cols={100}
                placeholder="Input (stdin)"
                value={stdin}
                onChange={(e) => {
                    setStdin(e.target.value);
                }}
            />
            <select
                name="language"
                value={language?.name}
                onChange={(e) =>
                    setLanguage(
                        languages.filter((cur) => {
                            return cur.name == e.target.value;
                        })[0]
                    )
                }>
                <option value="" disabled>
                    Select language
                </option>
                {languages.map((cur) => {
                    return (
                        <option value={cur.name} key={cur.name}>
                            {cur.name}
                        </option>
                    );
                })}
            </select>
            <div>{error}</div>
            <textarea value={output} rows={10} cols={100} disabled />
            <button onClick={handleRunCode}>run</button>
        </>
    );
};

export default CodeEditor;
