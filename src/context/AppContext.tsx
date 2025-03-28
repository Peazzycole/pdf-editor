"use client";

import React, { createContext, useContext, useCallback, useState } from "react";
import { Annotation } from "@/utils/types";
import { PDFDocument, rgb } from "pdf-lib";

interface AppContextProps {
    annotations: Annotation[];
    containerWidth: number;
    setAnnotations: React.Dispatch<React.SetStateAction<Annotation[]>>;
    setContainerWidth: React.Dispatch<React.SetStateAction<number>>;
    downloadAnnotatedPdf: (file: File) => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Manage annotations state directly inside the AppProvider
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [containerWidth, setContainerWidth] = useState<number>(0);

    const downloadAnnotatedPdf = useCallback(async (file: File) => {
        const pdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
            const r = parseInt(hex.slice(1, 3), 16) / 255;
            const g = parseInt(hex.slice(3, 5), 16) / 255;
            const b = parseInt(hex.slice(5, 7), 16) / 255;
            return { r, g, b };
        };

        for (const annotation of annotations) {
            const page = pdfDoc.getPage(annotation.pageNumber - 1);
            const originalWidth = page.getWidth();
            const scale = containerWidth / originalWidth;

            if (annotation.path) {
                const color = annotation.color ? hexToRgb(annotation.color) : { r: 0, g: 0, b: 0 };
                for (let i = 1; i < annotation.path.length; i++) {
                    const start = annotation.path[i - 1];
                    const end = annotation.path[i];
                    const startX = start.x / scale;
                    const startY = page.getHeight() - (start.y / scale);
                    const endX = end.x / scale;
                    const endY = page.getHeight() - (end.y / scale);
                    page.drawLine({
                        start: { x: startX, y: startY },
                        end: { x: endX, y: endY },
                        thickness: 1.5,
                        color: rgb(color.r, color.g, color.b),
                    });
                }
            } else if (annotation.rects) {
                for (const rect of annotation.rects) {
                    const pdfX = rect.left / scale;
                    const pdfYBottom = page.getHeight() - ((rect.top + rect.height) / scale);
                    const pdfWidth = rect.width / scale;
                    const pdfHeight = rect.height / scale;

                    if (annotation.type === "highlight") {
                        const color = annotation.color ? hexToRgb(annotation.color) : { r: 1, g: 1, b: 0 };
                        page.drawRectangle({
                            x: pdfX,
                            y: pdfYBottom,
                            width: pdfWidth,
                            height: pdfHeight,
                            color: rgb(color.r, color.g, color.b),
                            opacity: 0.2,
                        });
                    } else if (annotation.type === "underline") {
                        const color = annotation.color ? hexToRgb(annotation.color) : { r: 0, g: 0, b: 1 };
                        page.drawLine({
                            start: { x: pdfX, y: pdfYBottom },
                            end: { x: pdfX + pdfWidth, y: pdfYBottom },
                            thickness: 1.5,
                            color: rgb(color.r, color.g, color.b),
                        });
                    }
                }
            }
        }

        const modifiedPdfBytes = await pdfDoc.save();
        const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "annotated.pdf";
        link.click();
        URL.revokeObjectURL(url);
    }, [annotations, containerWidth]);

    return (
        <AppContext.Provider value={{
            annotations,
            setAnnotations,
            downloadAnnotatedPdf,
            containerWidth,
            setContainerWidth
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};