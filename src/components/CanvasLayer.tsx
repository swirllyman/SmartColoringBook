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
}

export const CanvasLayer = ({
    width, height,
    color, lineWidth,
    className, disabled,
    tool = 'brush',
    lockAlpha = false
}: CanvasLayerProps) => {
    const { canvasRef, onPointerDown: pDown, onPointerMove: pMove, onPointerUp: pUp } = useDraw(drawLine);

    const handlers = disabled ? {} : {
        onPointerDown: pDown,
        onPointerMove: pMove,
        onPointerUp: pUp,
        onPointerLeave: pUp
    };

    function drawLine({ ctx, currentPoint, prevPoint }: DrawContext) {
        const startPoint = prevPoint ?? currentPoint;

        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = lineWidth;

        if (tool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
        } else {
            // "source-atop" draws new color ONLY on top of existing non-transparent pixels.
            // "source-over" draws normally (everywhere).
            ctx.globalCompositeOperation = lockAlpha ? 'source-atop' : 'source-over';
            ctx.strokeStyle = color;
        }

        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();

        if (tool !== 'eraser') {
            ctx.fillStyle = color;
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
