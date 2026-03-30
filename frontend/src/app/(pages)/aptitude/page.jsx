"use client";
import Question from "@/components/Question";
import api from "@/utils/api";
import React, { useEffect, useState } from "react";

const page = () => {
    const [questions, setQuestions] = useState([]);
    const [difficulty, setDifficulty] = useState("easy");
    const [problemType, setProblemType] = useState("random");
    const [numQuestions, setNumQuestions] = useState(15);
    const problemTypes = [
        "random",
        "age",
        "calender",
        "interest",
        "mixtureAndAlligation",
        "permutationAndCombination",
        "speedTimeAndDistance",
        "pipesAndCisterns",
        "profitAndLoss",
    ];
    const fetchData = async () => {
        try {
            const { data } = await api.get(
                `/aptitude/questions?problemType=${problemType}&numQuestions=${numQuestions}&difficulty=${difficulty}`
            );
            setQuestions(data.data);
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <div>
            <input
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
            />
            <select
                value={problemType}
                onChange={(e) => setProblemType(e.target.value)}>
                {problemTypes.map((type, idx) => {
                    return (
                        <option key={idx} value={type}>
                            {type}
                        </option>
                    );
                })}
            </select>
            <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
            <button onClick={fetchData}>Fetch Questions</button>
            {questions &&
                questions.map((cur, idx) => {
                    return <Question key={idx} question={cur} />;
                })}
        </div>
    );
};

export default page;
