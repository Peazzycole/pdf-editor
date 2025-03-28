import { motion, AnimatePresence } from "framer-motion";
import SideBar from "@/components/SideBar";

interface MobileSidebarOverlayProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleFileChange: (uploadedFile: File) => Promise<void>;
    setActiveTool: React.Dispatch<React.SetStateAction<"highlight" | "signature" | null>>;
    activeTool: "highlight" | "signature" | null;
    toolColor: string;
    setToolColor: React.Dispatch<React.SetStateAction<string>>;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    file: File | null;
}

export default function MobileSidebarOverlay({
    isSidebarOpen,
    setIsSidebarOpen,
    handleFileChange,
    setActiveTool,
    activeTool,
    toolColor,
    setToolColor,
    setFile,
    file,
}: MobileSidebarOverlayProps) {
    return (
        <AnimatePresence>
            {isSidebarOpen && (
                <motion.div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm bg-opacity-50 md:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <motion.div
                        className="fixed top-0 left-0 h-full p-6 bg-white shadow-lg"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <SideBar
                            showCloseButton={true}
                            setIsSidebarOpen={setIsSidebarOpen}
                            handleFileChange={handleFileChange}
                            setActiveTool={setActiveTool}
                            activeTool={activeTool}
                            toolColor={toolColor}
                            setToolColor={setToolColor}
                            setFile={setFile}
                            file={file}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}