import { useEffect, useRef, useState } from 'react';

export interface Point {
    x: number;
    y: number;
}

export interface DrawContext {
    ctx: CanvasRenderingContext2D;
    currentPoint: Point;
    prevPoint: Point | null;
}

export const useDraw = (onDraw: (draw: DrawContext) => void) => {
    const [drawing, setDrawing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const prevPoint = useRef<Point | null>(null);

    const onPointerDown = () => {
        setDrawing(true);
    };

    const onPointerUp = () => {
        setDrawing(false);
        prevPoint.current = null;
    };

    const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!drawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        // Map screen pixels to canvas internal pixels
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const currentPoint = { x, y };

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
        prevPoint.current = currentPoint;
    };

    // Add event listeners for end/leave to ensure drawing stops
    useEffect(() => {
        const handleUp = () => {
            setDrawing(false);
            prevPoint.current = null;
        };

        // We attach these to window to catch releases outside the canvas
        window.addEventListener('pointerup', handleUp);
        return () => window.removeEventListener('pointerup', handleUp);
    }, []);

    return {
        canvasRef,
        onPointerDown,
        onPointerMove,
        onPointerUp
    };
};
