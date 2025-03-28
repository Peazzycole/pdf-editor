"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import Header from "@/components/Header";
import MobileSidebarOverlay from "@/components/MobileSidebarOverlay";
import MainContent from "@/components/MainContent";

type NotificationType = {
  type: "success" | "error";
  message: string;
};

export default function Home() {
  const { downloadAnnotatedPdf, setAnnotations } = useAppContext();
  const [file, setFile] = useState<File | null>(null);
  const [activeTool, setActiveTool] = useState<
    "highlight" | "signature" | null
  >(null);
  const [toolColor, setToolColor] = useState<string>("#FFFF00");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationType | null>(
    null
  );

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    setActiveTool(null);
    setAnnotations([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleFileChange = async (uploadedFile: File) => {
    setIsLoading(true);
    setNotification(null);
    if (!uploadedFile.type.includes("pdf")) {
      showNotification("error", "Please Upload a PDF file");
      setIsLoading(false);
      return;
    }
    setFile(uploadedFile);
    showNotification("success", "PDF uploaded successfully");
    setIsSidebarOpen(false);
    setIsLoading(false);
  };

  const handleSave = () => {
    downloadAnnotatedPdf(file!);
    showNotification("success", "PDF Downloaded successfully");
  };

  return (
    <main className="flex min-h-screen w-full flex-col bg-gray-50">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-md shadow-lg ${notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
              }`}
          >
            {notification.type === "success" ? (
              <Check className="inline mr-2" />
            ) : (
              <AlertTriangle className="inline mr-2" />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <Header
        file={file}
        setActiveTool={setActiveTool}
        handleSave={handleSave}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Mobile Sidebar Overlay */}
      <MobileSidebarOverlay
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleFileChange={handleFileChange}
        setActiveTool={setActiveTool}
        activeTool={activeTool}
        toolColor={toolColor}
        setToolColor={setToolColor}
        setFile={setFile}
        file={file}
      />

      {/* Main Content */}
      <MainContent
        file={file}
        isLoading={isLoading}
        handleFileChange={handleFileChange}
        activeTool={activeTool}
        toolColor={toolColor}
        setActiveTool={setActiveTool}
        setToolColor={setToolColor}
        setFile={setFile}
      />
    </main>
  );
}
