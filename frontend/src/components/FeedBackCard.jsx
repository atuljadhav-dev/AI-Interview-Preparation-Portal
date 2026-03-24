import Link from "next/link";

const FeedBackCard = ({ data }) => {
    const { feedback } = data;
    const { evaluation, jobTitle, roundName } = feedback;
    const { justification, score } = evaluation;
    return (
        <div className="mb-4 bg-white dark:bg-black border border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-purple-600 transition">
            <h2 className="text-xl font-bold mb-2">
                {jobTitle} - {roundName}
            </h2>
            <p className=" mb-2">
                <span className="font-semibold">Score:</span> {score}
            </p>
            <p className="">
                <span className="font-semibold">Justification:</span>{" "}
                {justification.slice(0, 100)}...
            </p>
            <Link
                href={`/feedback/${data.interviewId}`}
                className="text-purple-500 hover:underline mt-2 inline-block">
                View Details
            </Link>
        </div>
    );
};

export default FeedBackCard;
