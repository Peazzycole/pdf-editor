import { useState } from "react";

const CommentIcon = ({ annotation, index }) => {
    const [showBubble, setShowBubble] = useState(false);

    return (
        <div
            key={`comment-icon-${index}`}
            className="absolute flex items-center justify-center w-6 h-6 text-white text-sm font-semibold rounded-full shadow-md hover:bg-blue-600 transition transform hover:scale-110 cursor-pointer z-40"
            style={{
                top: annotation.rects[0].top - 11,
                left: annotation.rects[0].left - 10,
            }}
            onClick={() => setShowBubble(!showBubble)}
            onMouseEnter={() => setShowBubble(true)}
            onMouseLeave={() => setShowBubble(false)}
        >
            🗨️

            {/* Chat Bubble */}
            {showBubble && (
                <div
                    className="absolute bg-white text-gray-900 text-sm p-3 rounded-lg shadow-lg border border-gray-300 w-52"
                    style={{
                        top: "-45px", // Positioning above the icon
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 50,
                    }}
                >
                    <div className="relative">
                        <div className="">{annotation.comment || "No comment available."}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentIcon;
