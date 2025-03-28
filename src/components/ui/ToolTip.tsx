"use client"

import { Annotation, AnnotationType, Tooltip } from '@/utils/types';
import React, { useRef, useEffect } from 'react';
import { FaHighlighter, FaUnderline, FaCommentAlt, FaTrash } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

type Props = {
    mainContainerRef: React.RefObject<HTMLDivElement | null>;
    toolColor: string;
    tooltip: Tooltip;
    setCommentModal: React.Dispatch<React.SetStateAction<{ annotation: Annotation | null; text: string }>>;
    setAnnotations: React.Dispatch<React.SetStateAction<Annotation[]>>;
    setTooltip: React.Dispatch<React.SetStateAction<Tooltip | null>>;
};

export default function ToolTip({
    mainContainerRef,
    tooltip,
    setCommentModal,
    setAnnotations,
    setTooltip,
    toolColor,
}: Props) {
    const tooltipRef = useRef<HTMLDivElement>(null);

    const applyAnnotation = (type: AnnotationType) => {
        if (tooltip?.range) {
            const range = tooltip.range;
            const pageElement = range.startContainer.parentElement?.closest(".react-pdf__Page");
            if (pageElement) {
                const pageNumber = Number.parseInt(pageElement.getAttribute("data-page-number") || "1", 10);
                const rects = Array.from(range.getClientRects()).map((rect) => ({
                    top: rect.top - pageElement.getBoundingClientRect().top,
                    left: rect.left - pageElement.getBoundingClientRect().left,
                    width: rect.width,
                    height: rect.height,
                }));
                const newAnnotation: Annotation = {
                    id: uuidv4(),
                    type,
                    pageNumber,
                    rects,
                    color: type !== "comment" ? toolColor : undefined,
                };
                if (type === "comment") {
                    setCommentModal({ annotation: newAnnotation, text: "" });
                } else {
                    setAnnotations((prev) => [...prev, newAnnotation]);
                }
                setTooltip(null);
                window.getSelection()?.removeAllRanges();
            }
        }
    };

    const removeAnnotations = (annotationsToRemove: Annotation[]) => {
        setAnnotations((prev) =>
            prev.filter((a) => !annotationsToRemove.some((toRemove) => toRemove.id === a.id))
        );
        setTooltip(null);
        window.getSelection()?.removeAllRanges();
    };

    // Adjust tooltip position to stay within viewport
    useEffect(() => {
        if (tooltipRef.current) {
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const containerRect = mainContainerRef.current?.getBoundingClientRect() || { top: 0, left: 0 };

            let adjustedTop = tooltip.y * 1.1 - containerRect.top;
            let adjustedLeft = tooltip.x * 1.2 - containerRect.left;

            // Adjust for right edge
            if (tooltipRect.right > viewportWidth) {
                adjustedLeft = viewportWidth - tooltipRect.width * 0.9; // 10px padding
            }
            // Adjust for left edge
            if (tooltipRect.left < 0) {
                adjustedLeft = tooltipRect.width - 5; // 10px padding from left
            }
            // Adjust for bottom edge
            if (tooltipRect.bottom > viewportHeight) {
                adjustedTop = viewportHeight - tooltipRect.height - 10; // 10px padding
            }

            tooltipRef.current.style.top = `${adjustedTop}px`;
            tooltipRef.current.style.left = `${adjustedLeft}px`;
        }
    }, [tooltip, mainContainerRef]);

    return (
        <div
            ref={tooltipRef}
            className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg z-50 flex space-x-2 items-center"
            style={{
                position: "fixed",
                top: tooltip.y * 1.1 - (mainContainerRef.current?.getBoundingClientRect().top || 0),
                left: tooltip.x * 1.2 - (mainContainerRef.current?.getBoundingClientRect().left || 0),
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
            }}
        >
            {tooltip.overlappingAnnotations && (
                <button
                    onClick={() => removeAnnotations(tooltip.overlappingAnnotations!)}
                    className="flex items-center space-x-1 bg-red-500 text-white px-3 py-2 rounded-md transition hover:bg-red-600"
                >
                    <FaTrash /> <span>Remove</span>
                </button>
            )}
            <button
                onClick={() => applyAnnotation("highlight")}
                className="flex items-center space-x-1 bg-yellow-400 text-black px-3 py-2 rounded-md transition hover:bg-yellow-500"
            >
                <FaHighlighter /> <span>Highlight</span>
            </button>
            <button
                onClick={() => applyAnnotation("underline")}
                className="flex items-center space-x-1 bg-blue-400 text-white px-3 py-2 rounded-md transition hover:bg-blue-500"
            >
                <FaUnderline /> <span>Underline</span>
            </button>
            <button
                onClick={() => applyAnnotation("comment")}
                className="flex items-center space-x-1 bg-green-500 text-white px-3 py-2 rounded-md transition hover:bg-green-600"
            >
                <FaCommentAlt /> <span>Comment</span>
            </button>
        </div>
    );
}