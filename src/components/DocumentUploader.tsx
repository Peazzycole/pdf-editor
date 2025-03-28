"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FileUp } from "lucide-react"

interface DocumentUploaderProps {
    onFileChange: (file: File) => void
}

export default function DocumentUploader({ onFileChange }: DocumentUploaderProps) {
    const [error, setError] = useState<string | null>(null)

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            setError(null)

            if (acceptedFiles.length === 0) {
                return
            }

            const file = acceptedFiles[0]

            if (file.type !== "application/pdf") {
                setError("Only PDF files are supported")
                return
            }

            onFileChange(file)
        },
        [onFileChange],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
        },
        maxFiles: 1,
    })

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-black bg-gray-400" : "border-gray-300 hover:border-black"}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-2">
                    <FileUp className="h-8 w-8 text-muted-foreground" />
                    <div className="space-y-1">
                        <p className="text-sm font-medium">{isDragActive ? "Drop the PDF here" : "Drag & drop a PDF file"}</p>
                        <p className="text-xs text-muted-foreground">or click to browse</p>
                    </div>
                </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    )
}

