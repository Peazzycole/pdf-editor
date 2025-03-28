import { FaBars } from "react-icons/fa";

interface HeaderProps {
    file: File | null;
    setActiveTool: React.Dispatch<
        React.SetStateAction<"highlight" | "signature" | null>
    >;
    handleSave: () => void;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({
    file,
    setActiveTool,
    handleSave,
    setIsSidebarOpen,
}: HeaderProps) {
    return (
        <header className="border-b border-gray-200 bg-white sticky top-0 z-30">
            <div className="max-w-[1440px] mx-auto flex h-16 items-center px-4 sm:px-6">
                <button
                    className="md:hidden mr-4"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <FaBars className="h-6 w-6 text-gray-600" />
                </button>
                <h1 className="text-lg font-semibold text-gray-800">PDF Editor</h1>
                <div className="ml-auto flex items-center gap-2">
                    {file && (
                        <>
                            <button
                                onClick={() => setActiveTool(null)}
                                className="block px-4 text-xs sm:text-sm py-2 font-medium cursor-pointer bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all duration-200"
                            >
                                Clear Tool
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-xs sm:text-sm font-bold cursor-pointer text-white rounded-md hover:bg-blue-700 transition-all duration-200"
                            >
                                Save PDF
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
