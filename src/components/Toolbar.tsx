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
    return (
        <div className="toolbar-top">
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
                    title="Color Picker"
                >
                    💉
                </button>
            </div>

            <div className="divider" />

            <input
                type="color"
                value={color}
                onChange={(e) => {
                    setColor(e.target.value);
                    setTool('brush'); // Auto-switch to brush on color pick
                }}
                title="Brush Color"
                className="color-picker"
            />

            <div className="size-slider">
                <span>Size: {brushSize}px</span>
                <input
                    type="range"
                    min="5"
                    max="100"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    title="Brush Size"
                />
            </div>

            <div className="divider" />

            <button onClick={onSave} className="action-btn primary" title="Save Image">
                💾 Save
            </button>
        </div>
    );
};
