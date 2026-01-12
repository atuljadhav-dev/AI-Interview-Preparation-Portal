import Link from "next/link";

const notFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-center mt-20">
                404 - Page Not Found
            </h1>
            <p className="text-center mt-4">
                The page you are looking for does not exist.
            </p>
            <Link href="/" className="mt-6 text-blue-500 hover:underline">
                Go back to Home
            </Link>
        </div>
    );
};

export default notFound;
