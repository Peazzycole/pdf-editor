export type AnnotationType = "highlight" | "underline" | "comment" | "signature";

export interface Annotation {
    id: string
    type: AnnotationType;
    pageNumber: number;
    rects?: {
        top: number;
        left: number;
        width: number;
        height: number;
    }[];
    path?: { x: number; y: number }[];
    color?: string;
    comment?: string;
}

export interface Tooltip {
    x: number;
    y: number;
    range: Range | null;
    overlappingAnnotations?: Annotation[];
}
