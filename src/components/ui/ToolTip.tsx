import { Annotation, AnnotationType, Tooltip } from '@/utils/types';
import React from 'react'
import { FaHighlighter, FaUnderline, FaCommentAlt, FaTrash } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

type Props = {
    mainContainerRef: React.RefObject<HTMLDivElement | null>
    toolColor: string
    tooltip: Tooltip
    setCommentModal: React.Dispatch<React.SetStateAction<{
        annotation: Annotation | null;
        text: string;
    }>>
    setAnnotations: React.Dispatch<React.SetStateAction<Annotation[]>>
    setTooltip: React.Dispatch<React.SetStateAction<Tooltip | null>>
}

export default function ToolTip({
    mainContainerRef,
    tooltip,
    setCommentModal,
    setAnnotations,
    setTooltip,
    toolColor
}: Props) {

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

    return (
        <div
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
    )
}
