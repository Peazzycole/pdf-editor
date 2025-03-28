"use client"

import { Annotation } from "@/utils/types";
import { useState } from "react";
import { FaCommentAlt } from "react-icons/fa";


type Props = {
    annotation: Annotation
    index: number
}

const CommentIcon = ({ annotation, index }: Props) => {
    const [showBubble, setShowBubble] = useState(false);

    return (
        <div
            key={`comment-icon-${index}`}
            className="absolute bg-transparent flex items-center justify-center w-6 h-6 text-white text-sm font-semibold rounded-full shadow-md transition transform hover:scale-110 cursor-pointer z-40"
            style={{
                top: annotation.rects![0].top - 13,
                left: annotation.rects![0].left - 10,
            }}
            onClick={() => setShowBubble(!showBubble)}
            onMouseEnter={() => setShowBubble(true)}
            onMouseLeave={() => setShowBubble(false)}
        >
            <FaCommentAlt className="text-gray-500" />

            {/* Chat Bubble */}
            {showBubble && (
                <div
                    className="absolute text-gray-900 text-sm p-3 rounded-lg border border-gray-300 w-52 bg-white"
                    style={{
                        top: "100%", // Positioning above the icon
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 50,
                    }}
                >
                    <div className="relative">
                        <p
                            className="break-words"
                            style={{
                                wordWrap: "break-word",
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                            }}
                        >
                            {annotation.comment || "No comment available."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentIcon;
