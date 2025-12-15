
import { useState } from 'react';

interface ToolbarProps {
    color: string;
    setColor: (color: string) => void;
    brushSize: number;
    setBrushSize: (size: number) => void;
    tool: 'brush' | 'eraser' | 'eyedropper' | 'fill' | 'stamp';
    setTool: (tool: 'brush' | 'eraser' | 'eyedropper' | 'fill' | 'stamp') => void;
    onSave: () => void;
}

const PALETTE_COLORS = [
    '#FF0000', // Red
    '#FFA500', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Lime Green (Brighter for kids)
    '#0000FF', // Blue
    '#800080', // Purple
    '#FF69B4', // Hot Pink
    '#8B4513', // Saddle Brown
    '#000000', // Black
    '#FFFFFF', // White
];

export const Toolbar = ({
    color, setColor,
    brushSize, setBrushSize,
    tool, setTool,
    onSave
}: ToolbarProps) => {
    const [isMixing, setIsMixing] = useState(false);

    // Helper: Mix two colors (Simple Averaging)
    const mixColors = (c1: string, c2: string) => {
        const hex2rgb = (hex: string) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return [r, g, b];
        };

        const [r1, g1, b1] = hex2rgb(c1);
        const [r2, g2, b2] = hex2rgb(c2);

        // Average
        const r = Math.round((r1 + r2) / 2);
        const g = Math.round((g1 + g2) / 2);
        const b = Math.round((b1 + b2) / 2);

        const rgb2hex = (r: number, g: number, b: number) =>
            "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

        return rgb2hex(r, g, b);
    };

    const handleColorClick = (clickedColor: string) => {
        if (isMixing) {
            const mixed = mixColors(color, clickedColor);
            setColor(mixed);
            setIsMixing(false); // Auto-turn off mixing after one mix? Or keep it on? 
            // Let's keep it on for "fun session" or turn off for simplicity?
            // "Magic Mix" usually implies a single action. Let's turn it off to avoid confusion.
        } else {
            setColor(clickedColor);
        }
        // Don't switch back to brush if we are using fill or stamp
        if (tool !== 'fill' && tool !== 'stamp') {
            setTool('brush');
        }
    };

    return (
        <div className="toolbar-top" style={{ flexWrap: 'wrap', height: 'auto', padding: '10px 20px', borderRadius: '30px' }}>

            {/* 1. Tools (Simple Icons) */}
            <div className="tool-group">
                <button
                    className={`tool-btn ${tool === 'brush' ? 'active' : ''}`}
                    onClick={() => setTool('brush')}
                    style={{ fontSize: '1.8rem' }}
                    title="Paint!"
                >
                    🖌️
                </button>
                <button
                    className={`tool-btn ${tool === 'eyedropper' ? 'active' : ''}`}
                    onClick={() => setTool('eyedropper')}
                    style={{ fontSize: '1.8rem' }}
                    title="Eyedropper"
                >
                    💉
                </button>
                <button
                    className={`tool-btn ${tool === 'fill' ? 'active' : ''}`}
                    onClick={() => setTool('fill')}
                    style={{ fontSize: '1.8rem' }}
                    title="Bucket Fill"
                >
                    🪣
                </button>
                <button
                    className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`}
                    onClick={() => setTool('eraser')}
                    style={{ fontSize: '1.8rem' }}
                    title="Eraser"
                >
                    🧼
                </button>
            </div>

            <div className="divider" />

            {/* 2. Simple Brush Sizes */}
            <div className="tool-group">
                {[10, 30, 60].map(size => (
                    <button
                        key={size}
                        className={`tool-btn ${brushSize === size ? 'active' : ''}`}
                        onClick={() => setBrushSize(size)}
                        style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Brush Size"
                    >
                        <div style={{
                            width: size / 2,
                            height: size / 2,
                            background: 'currentColor',
                            borderRadius: '50%'
                        }} />
                    </button>
                ))}
            </div>

            <div className="divider" />

            {/* 3. Color Palette & Magic Mixer */}
            <div className="tool-group" style={{ gap: '8px' }}>
                {/* Current Color / Mixer Toggle */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '10px' }}>
                    <button
                        onClick={() => setIsMixing(!isMixing)}
                        style={{
                            width: '50px', height: '50px',
                            borderRadius: '50%',
                            background: isMixing
                                ? `conic-gradient(from 0deg, red, yellow, lime, aqua, blue, magenta, red)`
                                : color,
                            border: '4px solid white',
                            boxShadow: isMixing ? '0 0 15px gold' : '0 2px 5px rgba(0,0,0,0.3)',
                            cursor: 'pointer',
                            animation: isMixing ? 'spin 4s linear infinite' : 'none',
                            transition: 'all 0.3s'
                        }}
                        title={isMixing ? "Tap a color to mix!" : "Current Color (Tap to Mix)"}
                    >
                        {isMixing && <span style={{ fontSize: '1.5rem' }}>✨</span>}
                    </button>
                    <span style={{ fontSize: '0.6rem', fontWeight: 'bold', marginTop: '4px' }}>
                        {isMixing ? "PICK ONE!" : "MIX"}
                    </span>
                </div>

                {/* Palette Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                    {PALETTE_COLORS.map(c => (
                        <button
                            key={c}
                            onClick={() => handleColorClick(c)}
                            style={{
                                width: '32px', height: '32px',
                                background: c,
                                borderRadius: '50%',
                                border: color === c && !isMixing ? '3px solid #333' : '2px solid white',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                cursor: 'pointer',
                                transform: color === c ? 'scale(1.1)' : 'scale(1)'
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="divider" />

            {/* 4. Save */}
            <button onClick={onSave} className="action-btn primary" style={{ fontSize: '1.2rem', padding: '0.5rem 1.2rem' }}>
                💾
            </button>

            {/* CSS Animation for spinning mixer */}
            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};
