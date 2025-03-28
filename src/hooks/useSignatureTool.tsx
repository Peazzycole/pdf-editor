"use client"

import { useEffect } from "react";
import { Annotation } from "@/utils/types";
import { v4 as uuidv4 } from "uuid";

interface UseSignatureToolProps {
    mainContainerRef: React.RefObject<HTMLDivElement | null>;
    activeTool: "highlight" | "signature" | null;
    toolColor: string;
    setCurrentPath: React.Dispatch<React.SetStateAction<{ x: number; y: number }[]>>;
    setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
    setAnnotations: React.Dispatch<React.SetStateAction<Annotation[]>>;
    setCurrentPageNumber: React.Dispatch<React.SetStateAction<number | null>>;
    isDrawing: boolean;
    currentPath: { x: number; y: number }[];
    currentPageNumber: number | null;
}

export const useSignatureTool = ({
    mainContainerRef,
    activeTool,
    toolColor,
    setCurrentPath,
    setIsDrawing,
    setAnnotations,
    setCurrentPageNumber,
    isDrawing,
    currentPath,
    currentPageNumber,
}: UseSignatureToolProps) => {
    useEffect(() => {
        const handleMouseDown = (event: MouseEvent) => {
            if (activeTool === "signature") {
                event.preventDefault();
                const pageElement = (event.target as Element).closest(".react-pdf__Page");
                if (pageElement) {
                    const pageNumber = parseInt(pageElement.getAttribute("data-page-number") || "1", 10);
                    const rect = pageElement.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;
                    setCurrentPageNumber(pageNumber);
                    setCurrentPath([{ x, y }]);
                    setIsDrawing(true);
                }
            }
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (isDrawing && currentPageNumber) {
                event.preventDefault();
                const pageElement = document.querySelector(
                    `.react-pdf__Page[data-page-number="${currentPageNumber}"]`
                );
                if (pageElement) {
                    const rect = pageElement.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;
                    setCurrentPath((prev) => [...prev, { x, y }]);
                }
            }
        };

        const handleMouseUp = (event: MouseEvent) => {
            if (isDrawing && currentPath.length > 0 && currentPageNumber) {
                event.preventDefault();
                const newAnnotation: Annotation = {
                    id: uuidv4(),
                    type: "signature",
                    pageNumber: currentPageNumber,
                    path: currentPath,
                    color: toolColor,
                };
                setAnnotations((prev) => [...prev, newAnnotation]);
                setCurrentPath([]);
                setCurrentPageNumber(null);
                setIsDrawing(false);
            }
        };

        const container = mainContainerRef.current;
        if (container && activeTool === "signature") {
            container.addEventListener("mousedown", handleMouseDown);
            container.addEventListener("mousemove", handleMouseMove);
            container.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            if (container) {
                container.removeEventListener("mousedown", handleMouseDown);
                container.removeEventListener("mousemove", handleMouseMove);
                container.removeEventListener("mouseup", handleMouseUp);
            }
        };
    }, [
        mainContainerRef,
        activeTool,
        toolColor,
        setCurrentPath,
        setIsDrawing,
        setAnnotations,
        setCurrentPageNumber,
        isDrawing,
        currentPath,
        currentPageNumber,
    ]);
};