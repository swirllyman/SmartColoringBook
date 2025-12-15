import { useDraw, type DrawContext } from '../hooks/useDraw';

interface CanvasLayerProps {
    width: number;
    height: number;
    color: string;
    lineWidth: number;
    className?: string;
    disabled?: boolean;
    tool?: 'brush' | 'eraser';
    lockAlpha?: boolean;
    onDrawEnd?: () => void;
}

export const CanvasLayer = ({
    width, height,
    color, lineWidth,
    className, disabled,
    tool = 'brush',
    lockAlpha = false,
    onDrawEnd
}: CanvasLayerProps) => {
    const { canvasRef, onPointerDown: pDown, onPointerMove: pMove, onPointerUp: pUp, hasDrawn } = useDraw(drawLine);

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
        pUp();
        if (onDrawEnd && hasDrawn.current) onDrawEnd();
    };

    const handlers = disabled ? {} : {
        onPointerDown: pDown,
        onPointerMove: pMove,
        onPointerUp: handlePointerUp,
        onPointerLeave: handlePointerUp
    };

    function drawLine({ ctx, currentPoint, prevPoint }: DrawContext) {
        const startPoint = prevPoint ?? currentPoint;

        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = lineWidth;

        let strokeColor = color;

        if (tool === 'eraser') {
            if (lockAlpha) {
                // Smart Erase: Paint White inside the shape to "undo" coloring
                // This preserves the alpha mask so the user can color it again.
                ctx.globalCompositeOperation = 'source-atop';
                strokeColor = '#ffffff';
            } else {
                // True Erase: Remove pixels to transparency
                ctx.globalCompositeOperation = 'destination-out';
            }
        } else {
            // Brush
            ctx.globalCompositeOperation = lockAlpha ? 'source-atop' : 'source-over';
            strokeColor = color;
        }

        ctx.strokeStyle = strokeColor;

        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();

        // Draw round caps manually for smooth lines (except for True Erase which handles its own caps via stroke)
        // Actually, even for True Erase, stroke() handles lineCap='round', but fill() is needed for single dots?
        // Let's stick to the previous logic: Fill circles for brushes.
        // Now "Smart Eraser" acts like a brush, so we fill circles for it too.
        if (tool !== 'eraser' || (tool === 'eraser' && lockAlpha)) {
            ctx.fillStyle = strokeColor;
            ctx.beginPath();
            ctx.arc(startPoint.x, startPoint.y, lineWidth / 2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            {...handlers}
            className={className}
            style={{ touchAction: 'none' }}
        />
    );
};
