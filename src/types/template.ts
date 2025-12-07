export interface TemplateLayer {
    name: string;
    icon?: string; // Emoji icon
    locked?: boolean; // If true, cannot be selected or drawn on
    color?: string; // Initial fill color (transparent if undefined)
    zIndex: number;
    drawFn?: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

export interface DrawingTemplate {
    id: string;
    name: string;
    layers: TemplateLayer[];
}
