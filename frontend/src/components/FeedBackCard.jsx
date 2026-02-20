import Link from "next/link";

const FeedBackCard = ({ data }) => {
    const { feedback } = data;
    const { evaluation, jobTitle, roundname } = feedback;
    const { justification, score } = evaluation;
    return (
        <div className="border rounded-lg p-4 mb-4">
            <h2 className="text-xl font-bold mb-2">
                {jobTitle} - {roundname}
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
                className="text-blue-500 hover:underline mt-2 inline-block">
                View Details
            </Link>
        </div>
    );
};

export default FeedBackCard;
