import NavBar from "@/components/NavBar";
export default function PagesLayout({ children }) {
    return (
        <div className="bg-purple-100 dark:bg-gray-950 ">
            <NavBar />
            {children}
        </div>
    );
}
