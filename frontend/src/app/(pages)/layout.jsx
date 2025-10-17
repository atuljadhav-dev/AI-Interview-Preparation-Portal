import NavBar from "@/components/NavBar";
export default function PagesLayout({ children }) {
    return (
        <>
            <NavBar />
            {children}
        </>
    );
}
