import { FaSpinner } from "react-icons/fa";
import { FileUp } from "lucide-react";

import DocumentUploader from "@/components/DocumentUploader";
import DocumentViewer from "@/components/DocumentViewer";
import SideBar from "@/components/SideBar";

interface MainContentProps {
    file: File | null;
    isLoading: boolean;
    handleFileChange: (file: File) => Promise<void>;
    activeTool: "highlight" | "signature" | null;
    toolColor: string;
    setActiveTool: React.Dispatch<React.SetStateAction<"highlight" | "signature" | null>>;
    setToolColor: React.Dispatch<React.SetStateAction<string>>;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function MainContent({
    file,
    isLoading,
    handleFileChange,
    activeTool,
    toolColor,
    setActiveTool,
    setToolColor,
    setFile,
}: MainContentProps) {
    return (
        <div className="max-w-[1440px] mx-auto w-full flex-1">
            <div className="flex items-start gap-6 p-4 sm:p-6 md:px-8">
                {/* Desktop Sidebar */}
                <div className="hidden md:block fixed top-20 z-30 -ml-2 h-fit w-64 shrink-0">
                    <SideBar
                        showCloseButton={false}
                        setIsSidebarOpen={() => { }}
                        handleFileChange={handleFileChange}
                        setActiveTool={setActiveTool}
                        activeTool={activeTool}
                        toolColor={toolColor}
                        setToolColor={setToolColor}
                        setFile={setFile}
                        file={file}
                    />
                </div>

                {/* Document Area */}
                <div className="w-full flex-1">
                    {!file ? (
                        <div className="flex w-full h-[calc(100vh-10rem)] flex-col items-center justify-center rounded-lg shadow-sm border-gray-200 border border-dashed p-12 bg-white">
                            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                <FileUp className="h-12 w-12 text-gray-400" />
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-gray-800">No document uploaded</h3>
                                    <p className="text-gray-500">Upload a PDF document to get started with annotations and signatures.</p>
                                </div>
                                <DocumentUploader onFileChange={handleFileChange} />
                            </div>
                        </div>
                    ) : isLoading ? (
                        <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
                            <FaSpinner className="animate-spin h-8 w-8 text-blue-600" />
                        </div>
                    ) : (
                        <div className="relative bg-white rounded-lg overflow-auto border border-gray-200 shadow-sm p-4">
                            <DocumentViewer file={file} toolColor={toolColor} activeTool={activeTool} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}