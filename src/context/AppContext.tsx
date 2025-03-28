"use client";

import React, { createContext, useContext, useCallback, useState } from "react";
import { Annotation } from "@/utils/types";
import { PDFArray, PDFDocument, PDFName, PDFString, rgb } from "pdf-lib";

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
                    } else if (annotation.type === "comment") {
                        const iconSize = 20;
                        const iconX = annotation.rects?.[0]?.left / scale || 50;
                        const iconY = annotation.rects?.[0]
                            ? page.getHeight() - ((annotation.rects[0].top + annotation.rects[0].height) / scale)
                            : page.getHeight() - 50;

                        // Create a text annotation with an icon.
                        const textAnnot = pdfDoc.context.obj({
                            Type: "Annot",
                            Subtype: "Text",
                            Rect: [iconX, iconY, iconX + iconSize, iconY + iconSize],
                            Contents: PDFString.of(annotation.comment || "Comment"),
                            // Use a standard icon name. Options include "Comment", "Key", "Note", etc.
                            Name: "Comment",
                            Open: false,
                            T: "Reviewer",
                        });

                        const textAnnotRef = pdfDoc.context.register(textAnnot);

                        // Get the existing Annots array, or create a new one if it doesn't exist
                        let annots = page.node.get(PDFName.of("Annots"));
                        if (!annots || !(annots instanceof PDFArray)) {
                            annots = pdfDoc.context.obj([]);
                            page.node.set(PDFName.of("Annots"), annots);
                        }

                        // Append the new annotation reference to the Annots array
                        (annots as PDFArray).push(textAnnotRef);
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