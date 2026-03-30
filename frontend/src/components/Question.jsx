import React from "react";

const Question = ({ question }) => {
    return (
        <div>
            <h1> {question.question}</h1>
            <h2>Options</h2>
            <ul>
                {question.options.map((option, index) => (
                    <li key={index} className="">
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Question;
