import { useState, useEffect, useRef } from 'react';
import { CanvasLayer } from './components/CanvasLayer';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { TemplateSelector } from './components/TemplateSelector';
import type { Layer } from './types/layer';
import type { DrawingTemplate } from './types/template';
import { TEMPLATES } from './data/templates';
import './App.css';

function App() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string>('');
  const [loadedTemplate, setLoadedTemplate] = useState<DrawingTemplate | null>(null);
  const initializedRefs = useRef<Set<string>>(new Set());
  // Space Key Tracker for Panning
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) setIsSpacePressed(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsSpacePressed(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Tools state
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(50);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'eyedropper'>('brush');

  // UI State - Active Panel
  const [activePanel, setActivePanel] = useState<'none' | 'templates' | 'layers' | 'ruler'>(
    window.innerWidth > 900 ? 'templates' : 'none'
  );

  // Canvas Navigation State
  const [viewState, setViewState] = useState({ scale: 1, offset: { x: 0, y: 0 } });
  const [isPanning, setIsPanning] = useState(false);

  // Grid State
  const [gridOpacity, setGridOpacity] = useState(0.1);
  const [gridScale, setGridScale] = useState(50);

  useEffect(() => {
    console.log("🚀 FLOATING UI CONTAINER MODE ACTIVE 🚀");
  }, []);

  const loadTemplate = (template: DrawingTemplate) => {
    const newLayers: Layer[] = template.layers.map((tl, index) => ({
      id: `${template.id}-${index}`,
      name: tl.name,
      visible: true,
      icon: tl.icon,
      locked: tl.locked,
      zIndex: tl.zIndex ?? index,
      lockAlpha: true // Default templates to alpha-locked
    }));

    setLayers(newLayers);
    const firstSelectable = newLayers.find(l => !l.locked && (l.zIndex ?? 0) < 900);
    setActiveLayerId(firstSelectable?.id || '');
    setLoadedTemplate(template);
    initializedRefs.current.clear();

    // Auto-Recenter on Load (Fit to Screen)
    const padding = 40; // px
    // Sidebar is floating now, so we use full width
    const availableWidth = window.innerWidth;
    const availableHeight = window.innerHeight;

    // Calculate max scale to fit
    const scaleX = (availableWidth - padding * 2) / 800;
    const scaleY = (availableHeight - padding * 2) / 600;
    const newScale = Math.min(scaleX, scaleY, 1.0); // Don't zoom in passed 100%

    // Just center strictly
    const offsetX = 0;
    const offsetY = 0;

    setViewState({ scale: newScale, offset: { x: offsetX, y: offsetY } });

    // On mobile, auto-close template picker after selection to show canvas
    if (window.innerWidth <= 900) {
      setActivePanel('none');
    }
  };

  // Load default template on start
  useEffect(() => {
    loadTemplate(TEMPLATES[0]);
  }, []);

  // Safe Draw Effect (with timeout for DOM readiness)
  useEffect(() => {
    if (!loadedTemplate) return;

    // Small delay to ensure DOM + Canvas elements are fully rendered/sized
    const timer = setTimeout(() => {
      layers.forEach((layer, index) => {
        if (initializedRefs.current.has(layer.id)) return;

        const canvas = document.querySelector(`.layer-wrapper:nth-child(${index + 1}) canvas`) as HTMLCanvasElement;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, 800, 600);
            const templateLayer = loadedTemplate.layers[index];
            if (templateLayer && templateLayer.drawFn) {
              templateLayer.drawFn(ctx, 800, 600);
              initializedRefs.current.add(layer.id);
            }
          }
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [layers, loadedTemplate]);

  const addLayer = () => {
    const newId = Date.now().toString();
    const newLayer = {
      id: newId,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      icon: '📄',
      locked: false,
      zIndex: layers.length,
      lockAlpha: false
    };
    initializedRefs.current.add(newId);
    setLayers([...layers, newLayer]);
    setActiveLayerId(newId);
  };

  const handleSave = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 600);

    layers.forEach((layer, i) => {
      if (!layer.visible) return;
      const layerCanvas = document.querySelector(`.layer-wrapper:nth-child(${i + 1}) canvas`) as HTMLCanvasElement;
      if (layerCanvas) {
        ctx.drawImage(layerCanvas, 0, 0);
      }
    });

    const link = document.createElement('a');
    link.download = `my-drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const toggleVisibility = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLayers(layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  const toggleAlphaLock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLayers(layers.map(l => l.id === id ? { ...l, lockAlpha: !l.lockAlpha } : l));
  };

  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Find a reference canvas to get the ACTUAL displayed size/position (centering/letterboxing)
    const referenceCanvas = document.querySelector('canvas');
    if (!referenceCanvas) return;

    const rect = referenceCanvas.getBoundingClientRect();

    // Check if click is within the actual canvas bounds
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      return; // Clicked in the black bars/empty space
    }

    // Map screen pixels (relative to canvas rect) to internal 800x600 pixels
    const scaleX = 800 / rect.width;
    const scaleY = 600 / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // EYEDROPPER LOGIC
    if (tool === 'eyedropper') {
      const sortedLayers = [...layers].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)).reverse();

      for (const layer of sortedLayers) {
        if (!layer.visible) continue;
        const index = layers.findIndex(l => l.id === layer.id);
        if (index === -1) continue;

        const canvas = document.querySelector(`.layer-wrapper:nth-child(${index + 1}) canvas`) as HTMLCanvasElement;
        if (!canvas) continue;

        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        try {
          const pixel = ctx.getImageData(x, y, 1, 1).data;
          if (pixel[3] > 0) {
            const hexColor = `#${toHex(pixel[0])}${toHex(pixel[1])}${toHex(pixel[2])}`;
            setColor(hexColor);
            setTool('brush');
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setColor('#ffffff');
      setTool('brush');
      return;
    }


    // SELECTION LOGIC
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      if (!layer.visible || layer.locked) continue;

      const canvas = document.querySelector(`.layer-wrapper:nth-child(${i + 1}) canvas`) as HTMLCanvasElement;
      if (!canvas) continue;
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      try {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        if (pixel[3] > 0) {
          setActiveLayerId(layer.id);
          return;
        }
      } catch (err) { }
    }

    setActiveLayerId('');
  };

  // LAYER COLOR MEMORY
  // 1. When Color changes, save it to the Active Layer
  useEffect(() => {
    if (!activeLayerId) return;
    setLayers(prevLayers => prevLayers.map(l =>
      l.id === activeLayerId ? { ...l, lastColor: color } : l
    ));
  }, [color]); // Intentionally NOT activeLayerId to avoid loops

  // 2. When Active Layer changes, restore its last color (if exists)
  useEffect(() => {
    if (!activeLayerId) return;
    const layer = layers.find(l => l.id === activeLayerId);
    // If layer has a memory, use it. 
    // If NOT (undefined), default to Black (or desired default) to avoid "leaking" the previous layer's color.
    // The user specifically requested: "use the last used color instead of the picked color."
    // This ensures we switch context completely.
    if (layer) {
      if (layer.lastColor) {
        setColor(layer.lastColor);
      } else {
        // New layer / No history -> Default to Black (or keep current? User said "instead of picked", implying strictness).
        // Let's safe-guard by defaulting to Black for fresh layers to ensure "fresh" feeling.
        setColor('#000000');
      }
    }
  }, [activeLayerId]);

  return (
    <div className="app-container">

      {/* 3. FLOATING UI CONTAINER - Sidebar + Panels */}
      <div className={`floating-ui-container ${activePanel !== 'none' ? 'panel-open' : ''}`}>

        {/* Sidebar (Always visible) */}
        <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />

        {/* Content Panel Area (Only one rendered at a time) */}
        {activePanel !== 'none' && (
          <div className="expanded-panel">

            {/* Templates */}
            {activePanel === 'templates' && (
              <div className="panel-content">
                <h3 className="panel-title">Pictures <button className="close-btn" onClick={() => setActivePanel('none')}>✖</button></h3>
                <TemplateSelector onSelect={loadTemplate} />
              </div>
            )}

            {/* Layers */}
            {activePanel === 'layers' && (
              <div className="panel-content">
                <div className="layers-header">
                  <h3>Layers</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={addLayer} className="mini-btn" title="Add Layer">➕</button>
                    <button className="close-btn" onClick={() => setActivePanel('none')}>✖</button>
                  </div>
                </div>

                <div className="layers-list">
                  {[...layers]
                    .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
                    .reverse()
                    .filter(l => l.name !== 'Outlines')
                    .map((layer) => (
                      <div
                        key={layer.id}
                        className={`layer-item ${layer.id === activeLayerId ? 'selected' : ''} ${layer.locked ? 'locked' : ''}`}
                        onClick={() => !layer.locked && setActiveLayerId(layer.id)}
                        style={{
                          borderLeft: `5px solid ${layer.lastColor || 'transparent'}`,
                        }}
                      >
                        <span onClick={(e) => toggleVisibility(layer.id, e)} className="visibility-icon" title="Visibility">
                          {layer.visible ? '👁️' : '🚫'}
                        </span>

                        <span className="layer-icon">{layer.icon || '📄'}</span>
                        <span className="layer-name">{layer.name}</span>

                        {!layer.locked && (
                          <span
                            onClick={(e) => toggleAlphaLock(layer.id, e)}
                            className={`action-icon ${layer.lockAlpha ? 'active' : ''}`}
                            title={layer.lockAlpha ? "Alpha Locked" : "Alpha Unlocked"}
                            style={{ marginLeft: 'auto', opacity: layer.lockAlpha ? 1 : 0.3, cursor: 'pointer' }}
                          >
                            {layer.lockAlpha ? '🔒' : '🔓'}
                          </span>
                        )}

                        {layer.locked && <span style={{ marginLeft: 'auto' }}>🔒</span>}
                      </div>
                    ))}
                </div>
                <div style={{ padding: '1rem 0' }}>
                  <button
                    className="action-btn secondary"
                    style={{ width: '100%', fontSize: '0.9rem' }}
                    onClick={(e) => {
                      const outlineLayer = layers.find(l => l.name === 'Outlines');
                      if (outlineLayer) toggleVisibility(outlineLayer.id, e);
                    }}
                  >
                    {layers.find(l => l.name === 'Outlines')?.visible ? 'Hide Lines ✏️' : 'Show Lines ✏️'}
                  </button>
                </div>
              </div>
            )}

            {/* Ruler */}
            {activePanel === 'ruler' && (
              <div className="panel-content">
                <h3 className="panel-title">Ruler / Grid <button className="close-btn" onClick={() => setActivePanel('none')}>✖</button></h3>
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="bg-control-group">
                    <label>Opacity: {Math.round(gridOpacity * 100)}%</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={gridOpacity}
                      onChange={(e) => setGridOpacity(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="bg-control-group">
                    <label>Grid Size: {gridScale}px</label>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      step="10"
                      value={gridScale}
                      onChange={(e) => setGridScale(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 1. TOP TOOLBAR (Always Visible) */}
      <div className="toolbar-container">
        <Toolbar
          color={color}
          setColor={setColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          tool={tool}
          setTool={setTool}
          onSave={handleSave}
        />
      </div>

      {/* 2. MAIN WORKSPACE (Canvas) */}
      <div
        className="main-workspace"
        style={{ touchAction: 'none' }} // Prevent browser zoom/pan
        onWheel={(e) => {
          // Zoom on Wheel
          e.preventDefault();
          const zoomIntensity = 0.1;
          const delta = -Math.sign(e.deltaY) * zoomIntensity;
          const newScale = Math.min(Math.max(viewState.scale + delta, 0.5), 5); // Limit zoom 0.5x to 5x
          setViewState(prev => ({ ...prev, scale: newScale }));
        }}
        onMouseDown={(e: React.MouseEvent) => {
          // Middle mouse or Spacebar+Left Click to Pan
          if (e.button === 1 || (e.button === 0 && isSpacePressed)) {
            e.preventDefault();
            setIsPanning(true);
          }
        }}
        onMouseMove={(e: React.MouseEvent) => {
          if (isPanning) {
            setViewState(prev => ({
              ...prev,
              offset: {
                x: prev.offset.x + e.movementX,
                y: prev.offset.y + e.movementY
              }
            }));
          }
        }}
        onMouseUp={() => setIsPanning(false)}
        onMouseLeave={() => setIsPanning(false)}
        // Touch Handlers for Pinch-to-Zoom & Pan
        onTouchStart={(e) => {
          if (e.touches.length === 2) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
            const cx = (touch1.clientX + touch2.clientX) / 2;
            const cy = (touch1.clientY + touch2.clientY) / 2;

            // Store initial values in refs
            (e.currentTarget as any)._lastTouchDist = dist;
            (e.currentTarget as any)._lastTouchCenter = { x: cx, y: cy };
            setIsPanning(true); // Re-use panning state to indicating active manipulation
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 2) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
            const cx = (touch1.clientX + touch2.clientX) / 2;
            const cy = (touch1.clientY + touch2.clientY) / 2;

            const element = e.currentTarget as any;
            const lastDist = element._lastTouchDist || dist;
            const lastCenter = element._lastTouchCenter || { x: cx, y: cy };

            // Calculate Scale Change
            const scaleFactor = dist / lastDist;
            // Calculate Pan Change
            const dx = cx - lastCenter.x;
            const dy = cy - lastCenter.y;

            setViewState(prev => {
              const newScale = Math.min(Math.max(prev.scale * scaleFactor, 0.5), 5);
              return {
                scale: newScale,
                offset: {
                  x: prev.offset.x + dx,
                  y: prev.offset.y + dy
                }
              };
            });

            // Update refs
            element._lastTouchDist = dist;
            element._lastTouchCenter = { x: cx, y: cy };
          }
        }}
        onTouchEnd={(e) => {
          if (e.touches.length < 2) {
            setIsPanning(false);
          }
        }}
      >
        <div
          className={`canvas-stack ${activeLayerId ? 'focus-mode' : ''}`}
          onClick={handleCanvasClick}
          style={{
            cursor: isPanning ? 'grabbing' : (tool === 'eyedropper' ? 'crosshair' : 'default'),
            // Offset Focus Logic: Shift canvas right to recenter in valid space when panel is open.
            // Sidebar(50) + Panel(260) = 310px covered on left. 
            // We shift by half of panel width ~130px to maintain perceived center.
            transform: `translate(${viewState.offset.x + (activePanel !== 'none' ? 130 : 0)}px, ${viewState.offset.y}px) scale(${viewState.scale})`,
            transformOrigin: 'center center',

            // Grid Background
            backgroundColor: '#ffffff',
            backgroundPosition: 'center center',
            backgroundImage: `
                  linear-gradient(rgba(0,0,0,${gridOpacity}) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,${gridOpacity}) 1px, transparent 1px)
              `,
            backgroundSize: `${gridScale}px ${gridScale}px`
          }}
        >
          {layers.map((layer) => (
            <div
              key={layer.id}
              className={`layer-wrapper ${layer.id === activeLayerId ? 'active' : ''}`}
              style={{ zIndex: layer.zIndex ?? 0, display: layer.visible ? 'block' : 'none' }}
            >
              <CanvasLayer
                width={800}
                height={600}
                color={layer.id === activeLayerId ? color : 'transparent'}
                lineWidth={brushSize}
                tool={tool === 'eyedropper' ? undefined : tool}
                lockAlpha={layer.lockAlpha ?? false}
                className="drawing-layer"
                disabled={layer.id !== activeLayerId || layer.locked || tool === 'eyedropper'}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
