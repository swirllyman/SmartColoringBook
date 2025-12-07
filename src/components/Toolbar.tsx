
import { useState, useRef, useEffect } from 'react';

interface ToolbarProps {
    color: string;
    setColor: (color: string) => void;
    brushSize: number;
    setBrushSize: (size: number) => void;
    tool: 'brush' | 'eraser' | 'eyedropper';
    setTool: (tool: 'brush' | 'eraser' | 'eyedropper') => void;
    onSave: () => void;
}

export const Toolbar = ({
    color, setColor,
    brushSize, setBrushSize,
    tool, setTool,
    onSave
}: ToolbarProps) => {
    const [showColorPanel, setShowColorPanel] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setShowColorPanel(false);
            }
        };
        if (showColorPanel) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColorPanel]);

    // Helpers
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    };

    const rgbToHex = (r: number, g: number, b: number) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    const rgb = hexToRgb(color);

    const updateColor = (key: 'r' | 'g' | 'b', val: number) => {
        const newRgb = { ...rgb, [key]: val };
        setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        setTool('brush');
    };

    return (
        <div className="toolbar-top">
            {/* Tools Group: Brushes */}
            <div className="tool-group">
                <button
                    className={`tool-btn ${tool === 'brush' ? 'active' : ''}`}
                    onClick={() => setTool('brush')}
                    title="Brush"
                >
                    🖌️
                </button>
                <button
                    className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`}
                    onClick={() => setTool('eraser')}
                    title="Eraser"
                >
                    🧼
                </button>
                <button
                    className={`tool-btn ${tool === 'eyedropper' ? 'active' : ''}`}
                    onClick={() => setTool('eyedropper')}
                    title="Eyedropper"
                >
                    💉
                </button>
            </div>

            <div className="divider" />

            {/* Properties Group: Color & Size */}
            <div className="tool-group">
                {/* Custom Color Trigger */}
                <div className="color-picker-wrapper" style={{ position: 'relative' }}>
                    <button
                        className="tool-btn"
                        onClick={() => setShowColorPanel(!showColorPanel)}
                        style={{
                            backgroundColor: color,
                            width: '36px', height: '36px',
                            borderRadius: '50%',
                            border: '2px solid white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                        title="Open Color Mixers"
                    />

                    {/* RGB Popout Panel - Bottom Side */}
                    {showColorPanel && (
                        <div
                            ref={panelRef}
                            className="rgb-panel"
                            style={{
                                position: 'absolute',
                                top: '150%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'var(--panel-bg)',
                                backdropFilter: 'blur(12px)',
                                padding: '1.25rem',
                                borderRadius: '24px',
                                border: '1px solid var(--border-color)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                width: '220px',
                                zIndex: 4000
                            }}
                        >
                            <h4 style={{ margin: 0, textAlign: 'center', fontSize: '0.95rem', opacity: 0.9 }}>Mix Color</h4>
                            {/* RED */}
                            <div className="rgb-slider-row">
                                <label style={{ color: '#ff4d4d', fontWeight: 'bold' }}>R</label>
                                <input
                                    type="range" min="0" max="255"
                                    value={rgb.r}
                                    onChange={(e) => updateColor('r', Number(e.target.value))}
                                    style={{ flex: 1, accentColor: '#ff4d4d' }}
                                />
                                <span>{rgb.r}</span>
                            </div>
                            {/* GREEN */}
                            <div className="rgb-slider-row">
                                <label style={{ color: '#2ecc71', fontWeight: 'bold' }}>G</label>
                                <input
                                    type="range" min="0" max="255"
                                    value={rgb.g}
                                    onChange={(e) => updateColor('g', Number(e.target.value))}
                                    style={{ flex: 1, accentColor: '#2ecc71' }}
                                />
                                <span>{rgb.g}</span>
                            </div>
                            {/* BLUE */}
                            <div className="rgb-slider-row">
                                <label style={{ color: '#3498db', fontWeight: 'bold' }}>B</label>
                                <input
                                    type="range" min="0" max="255"
                                    value={rgb.b}
                                    onChange={(e) => updateColor('b', Number(e.target.value))}
                                    style={{ flex: 1, accentColor: '#3498db' }}
                                />
                                <span>{rgb.b}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Size Slider */}
                <div className="size-slider">
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '2px', textAlign: 'center', width: '100%' }}>Size: {brushSize}</span>

                    {/* Range Wrapper for proper centering */}
                    <div className="slider-wrapper" style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', height: '24px' /* Ensure wrapper has height */ }}>
                        {/* Brush Preview Circle */}
                        <div
                            style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: `${brushSize}px`,
                                height: `${brushSize}px`,
                                borderRadius: '50%',
                                backgroundColor: color,
                                opacity: 0.3,
                                pointerEvents: 'none',
                                zIndex: 0,
                                transition: 'width 0.1s ease, height 0.1s ease'
                            }}
                        />

                        <input
                            type="range"
                            min="5"
                            max="75"
                            step="5"
                            value={brushSize}
                            onChange={(e) => setBrushSize(Number(e.target.value))}
                            title={`Brush Size: ${brushSize}px`}
                            list="brush-sizes"
                            className="styled-range"
                            style={{ position: 'relative', zIndex: 1, width: '100%', margin: 0 }}
                        />
                        <datalist id="brush-sizes">
                            <option value="5" />
                            <option value="25" />
                            <option value="50" />
                            <option value="75" />
                        </datalist>
                    </div>
                </div>
            </div>

            <div className="divider" />

            <button onClick={onSave} className="action-btn primary" title="Save Image">
                💾 Save
            </button>
        </div>
    );
};
