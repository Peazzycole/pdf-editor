"use client"

import { useCallback } from "react";
import { Annotation, Tooltip } from "@/utils/types";

interface UseTextSelectionProps {
    annotations: Annotation[];
    setTooltip: React.Dispatch<React.SetStateAction<Tooltip | null>>;
    doRectsOverlap: (
        rect1: { top: number; left: number; width: number; height: number },
        rect2: { top: number; left: number; width: number; height: number }
    ) => boolean;
}

export const useTextSelection = ({
    annotations,
    setTooltip,
    doRectsOverlap,
}: UseTextSelectionProps) => {
    const handleTextSelection = useCallback(
        (event: React.MouseEvent) => {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const pageElement = range.startContainer.parentElement?.closest(".react-pdf__Page");
                if (pageElement) {
                    const pageNumber = Number.parseInt(pageElement.getAttribute("data-page-number") || "1", 10);
                    const selectionRects = Array.from(range.getClientRects()).map((rect) => ({
                        top: rect.top - pageElement.getBoundingClientRect().top,
                        left: rect.left - pageElement.getBoundingClientRect().left,
                        width: rect.width,
                        height: rect.height,
                    }));

                    const overlappingAnnotations = annotations.filter((a) => {
                        if (a.pageNumber !== pageNumber) return false;

                        // Check for overlapping rects (e.g., highlights)
                        if (a.rects?.some((aRect) => selectionRects.some((sRect) => doRectsOverlap(aRect, sRect)))) {
                            return true;
                        }

                        if (a.type === "signature" && a.path) {
                            const clickX = event.clientX - pageElement.getBoundingClientRect().left;
                            const clickY = event.clientY - pageElement.getBoundingClientRect().top;

                            // Check if the click is near any point in the signature path
                            const isNearPath = a.path.some((point) => {
                                const distance = Math.sqrt(
                                    Math.pow(point.x - clickX, 2) + Math.pow(point.y - clickY, 2)
                                );
                                return distance < 200;
                            });

                            return isNearPath;
                        }

                        return false;
                    });
                    console.log(overlappingAnnotations)

                    if (selection.type === "Caret" && overlappingAnnotations.length === 0) {
                        setTooltip(null);
                        return;
                    }

                    setTooltip({
                        x: event.clientX,
                        y: event.clientY,
                        range,
                        overlappingAnnotations: overlappingAnnotations.length > 0 ? overlappingAnnotations : undefined,
                    });
                }
            }
        },
        [annotations, setTooltip, doRectsOverlap]
    );

    return { handleTextSelection };
};