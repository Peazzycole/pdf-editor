"use client"

import { Annotation } from '@/utils/types';
import React from 'react'

type Props = {
    setCommentModal: React.Dispatch<React.SetStateAction<{
        annotation: Annotation | null;
        text: string;
    }>>
    commentModal: {
        annotation: Annotation | null;
        text: string;
    }
    saveComment: () => void
}

export default function CommentModal({ setCommentModal, commentModal, saveComment }: Props) {
    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setCommentModal({ annotation: null, text: "" })}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold text-gray-800">Add a Comment</h2>
                <textarea
                    className="w-full border resize-none border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    rows={4}
                    placeholder="Write your comment here..."
                    value={commentModal.text}
                    onChange={(e) => setCommentModal({ ...commentModal, text: e.target.value })}
                />
                <div className="flex justify-end space-x-2">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-md transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                        onClick={saveComment}
                    >
                        Save
                    </button>
                    <button
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition hover:bg-gray-400 focus:ring-2 focus:ring-gray-400"
                        onClick={() => setCommentModal({ annotation: null, text: "" })}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
