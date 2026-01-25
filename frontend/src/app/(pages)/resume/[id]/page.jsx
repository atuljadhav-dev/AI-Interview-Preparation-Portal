import PdfViewer from "@/components/PdfViewer";

const page = async ({ params }) => {
    const { id } = await params;

    return (
        <div className="h-[calc(100vh-64px)] bg-red-500">
            <PdfViewer id={id} />
        </div>
    );
};

export default page;
