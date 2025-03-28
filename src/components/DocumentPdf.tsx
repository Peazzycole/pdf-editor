"use client"

import { Loader } from 'lucide-react';
import React, { useState } from 'react'
import { Document, Page } from 'react-pdf';
import CommentIcon from './ui/CommentIcon';
import { Annotation } from '@/utils/types';

type Props = {
  src: string
  containerRef: React.RefObject<HTMLDivElement | null>
  containerWidth: number
  annotations: Annotation[]
  isDrawing: boolean
  currentPageNumber: number | null
  currentPath: {
    x: number;
    y: number;
  }[]
  toolColor: string
}

export default function DocumentPdf({
  src,
  containerRef,
  containerWidth,
  annotations,
  isDrawing,
  currentPageNumber,
  currentPath,
  toolColor
}: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }


  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }} className="flex items-center justify-center">
      <Document file={src} onLoadSuccess={onDocumentLoadSuccess} loading={<Loader />}>
        {Array.from({ length: numPages || 0 }, (_, i) => (
          <div key={i + 1} style={{ marginBottom: "20px", position: "relative" }}>
            <Page pageNumber={i + 1} width={containerWidth} />
            {annotations
              .filter((a) => a.pageNumber === i + 1 && a.rects)
              .flatMap((a, index) =>
                a.rects!.map((rect, rectIndex) => (
                  <div
                    key={`${index}-${rectIndex}`}
                    style={{
                      position: "absolute",
                      top: a.type === "underline" ? rect.top + rect.height - 2 : rect.top,
                      left: rect.left,
                      width: rect.width,
                      height: a.type === "highlight" ? rect.height : 2,
                      backgroundColor: a.type === "highlight" ? a.color : "transparent",
                      borderBottom: a.type === "underline" ? `2px solid ${a.color}` : "none",
                      opacity: a.type === "underline" ? 1 : 0.2,
                      pointerEvents: "auto",
                    }}
                  />
                ))
              )}
            {annotations
              .filter((a) => a.pageNumber === i + 1 && a.path)
              .map((a, index) => {
                const points = a.path!.map((p) => `${p.x},${p.y}`).join(" ");
                return (
                  <svg
                    key={`signature-${index}`}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                  >
                    <path
                      d={`M ${points}`}
                      stroke={a.color || "black"}
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                );
              })}
            {isDrawing && currentPageNumber === i + 1 && (
              <svg
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              >
                <path
                  d={`M ${currentPath.map((p) => `${p.x},${p.y}`).join(" ")}`}
                  stroke={toolColor}
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            )}
            {annotations
              .filter((a) => a.pageNumber === i + 1 && a.comment)
              .map((a, index) => (
                <CommentIcon annotation={a} index={index} key={`comment-icon-${index}`} />
              ))}
          </div>
        ))}
      </Document>
    </div>
  )
}
