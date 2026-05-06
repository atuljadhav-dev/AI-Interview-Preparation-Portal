import Link from "next/link";

const notFound = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white flex flex-col items-center justify-center">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl mb-6">Page Not Found</p>
            <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Go Home
            </Link>
        </div>
    );
};

export default notFound;
