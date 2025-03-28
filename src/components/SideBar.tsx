import React, { Dispatch, SetStateAction, useState } from "react";
import { FaTimes, FaHighlighter, FaSignature, FaFileAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion } from "framer-motion";
import DocumentUploader from "./DocumentUploader";

type Props = {
    showCloseButton: boolean;
    setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
    handleFileChange: (uploadedFile: File) => Promise<void>;
    setActiveTool: Dispatch<SetStateAction<"highlight" | "signature" | null>>;
    activeTool: "highlight" | "signature" | null;
    toolColor: string;
    setToolColor: Dispatch<SetStateAction<string>>;
    setFile: Dispatch<SetStateAction<File | null>>;
    file: File | null;
};

export default function SideBar({
    showCloseButton,
    setIsSidebarOpen,
    handleFileChange,
    setActiveTool,
    activeTool,
    toolColor,
    setToolColor,
    setFile,
    file,
}: Props) {
    const [isExpanded, setIsExpanded] = useState(true); // State to control accordion behavior

    return (
        <div className={`w-64 bg-white p-4 ${!isExpanded && "pb-0"} rounded-lg shadow-md border border-gray-200 space-y-4`}>
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">🛠 Tools</h2>
                {showCloseButton ? (
                    <button onClick={() => setIsSidebarOpen(false)}>
                        <FaTimes className="h-5 w-5 text-gray-600" />
                    </button>
                ) : (
                    <button onClick={() => setIsExpanded((prev) => !prev)}>
                        {isExpanded ? (
                            <FaChevronUp className="h-5 w-5 cursor-pointer text-gray-600" />
                        ) : (
                            <FaChevronDown className="h-5 w-5 cursor-pointer text-gray-600" />
                        )}
                    </button>
                )}
            </div>

            <motion.div
                initial={{ height: "auto" }}
                animate={{ height: isExpanded ? "auto" : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                {!file ? (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800">Get Started</h2>
                        <p className="text-sm text-gray-600">
                            Upload a PDF document to begin annotating and signing.
                        </p>
                        <DocumentUploader onFileChange={handleFileChange} />
                    </div>
                ) : (
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveTool("highlight")}
                            className={`flex items-center cursor-pointer space-x-2 w-full px-4 py-2 rounded-md transition-all duration-200 ${activeTool === "highlight"
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-100 hover:bg-gray-200"
                                }`}
                        >
                            <FaHighlighter />
                            <span>Change Color</span>
                            {activeTool === "highlight" && (
                                <div
                                    className="w-4 h-4 rounded-full border border-white"
                                    style={{ backgroundColor: toolColor }}
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTool("signature")}
                            className={`flex items-center cursor-pointer space-x-2 w-full px-4 py-2 rounded-md transition-all duration-200 ${activeTool === "signature"
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-100 hover:bg-gray-200"
                                }`}
                        >
                            <FaSignature />
                            <span>Draw Signature</span>
                            {activeTool === "signature" && (
                                <div
                                    className="w-4 h-4 rounded-full border border-white"
                                    style={{ backgroundColor: toolColor }}
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setFile(null)}
                            className="flex items-center cursor-pointer space-x-2 w-full px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                        >
                            <FaFileAlt />
                            <span>Change Document</span>
                        </button>
                    </div>
                )}
                {activeTool === "highlight" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">🎨 Select Color</label>
                        <input
                            type="color"
                            value={toolColor}
                            onChange={(e) => setToolColor(e.target.value)}
                            className="w-full h-10 rounded-md border border-gray-200 mt-1"
                        />
                    </div>
                )}
            </motion.div>
        </div>
    );
}