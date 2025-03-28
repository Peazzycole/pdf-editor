"use client";

import type React from "react";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { useMemo, useState, useRef, useEffect } from "react";
import { pdfjs } from "react-pdf";
import CommentModal from "./ui/CommentModal";
import { Annotation, Tooltip } from "@/utils/types";
import ToolTip from "./ui/ToolTip";
import DocumentPdf from "./DocumentPdf";
import { useSignatureTool } from "@/hooks/useSignatureTool";
import { useTextSelection } from "@/hooks/useTextSelection";
import { useAppContext } from "@/context/AppContext";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function DocumentViewer({ file, toolColor, activeTool }: { file: File; toolColor: string; activeTool: 'highlight' | 'signature' | null }) {
    const { annotations, setAnnotations, containerWidth, setContainerWidth } = useAppContext();
    const [tooltip, setTooltip] = useState<Tooltip | null>(null);
    const [commentModal, setCommentModal] = useState<{ annotation: Annotation | null; text: string }>({
        annotation: null,
        text: "",
    });
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
    const [currentPageNumber, setCurrentPageNumber] = useState<number | null>(null);

    const doRectsOverlap = (
        rect1: { top: number; left: number; width: number; height: number },
        rect2: { top: number; left: number; width: number; height: number }
    ) => {
        return (
            rect1.left < rect2.left + rect2.width &&
            rect1.left + rect1.width > rect2.left &&
            rect1.top < rect2.top + rect2.height &&
            rect1.top + rect1.height > rect2.top
        );
    };

    const { handleTextSelection } = useTextSelection({
        annotations,
        setTooltip,
        doRectsOverlap,
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const mainContainerRef = useRef<HTMLDivElement>(null);

    const src = useMemo(() => URL.createObjectURL(file), [file]);

    useEffect(() => {
        const updateContainerWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };
        updateContainerWidth();
        window.addEventListener("resize", updateContainerWidth);
        return () => window.removeEventListener("resize", updateContainerWidth);
    }, [src, setContainerWidth]);

    useSignatureTool({
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
    });



    const saveComment = () => {
        if (commentModal.text.trim() === "") {
            setCommentModal({ annotation: null, text: "" });
            return;
        }
        if (commentModal.annotation) {
            const updatedAnnotation = { ...commentModal.annotation, comment: commentModal.text };
            setAnnotations((prev) => [...prev, updatedAnnotation]);
        }
        setCommentModal({ annotation: null, text: "" });
    };


    return (
        <div
            ref={mainContainerRef}
            className="max-h-[800px] border border-gray-200 py-2 overflow-y-auto overflow-x-hidden relative"
            style={{ cursor: activeTool === "signature" ? "crosshair" : "default" }}
            onMouseUp={(event) => {
                if (activeTool !== "signature") {
                    handleTextSelection(event);
                }
            }}
        >
            <DocumentPdf
                src={src}
                containerRef={containerRef}
                containerWidth={containerWidth}
                annotations={annotations}
                isDrawing={isDrawing}
                currentPageNumber={currentPageNumber}
                currentPath={currentPath}
                toolColor={toolColor}
            />
            {tooltip && (
                <ToolTip
                    tooltip={tooltip}
                    mainContainerRef={mainContainerRef}
                    setAnnotations={setAnnotations}
                    setCommentModal={setCommentModal}
                    setTooltip={setTooltip}
                    toolColor={toolColor}
                />
            )}
            {commentModal.annotation && (
                <CommentModal
                    commentModal={commentModal}
                    setCommentModal={setCommentModal}
                    saveComment={saveComment}
                />
            )}
        </div>
    );
}