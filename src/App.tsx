import { useState, useEffect, useRef } from 'react';
import { CanvasLayer } from './components/CanvasLayer';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { TemplateSelector } from './components/TemplateSelector';
import { StampsPanel } from './components/StampsPanel';
import { floodFill } from './utils/floodFill';
import type { Layer } from './types/layer';
import type { DrawingTemplate } from './types/template';
import { TEMPLATES } from './data/templates';
import './App.css';

interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

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
  const [tool, setTool] = useState<'brush' | 'eraser' | 'eyedropper' | 'fill' | 'stamp'>('brush');
  const [currentStamp, setCurrentStamp] = useState('⭐');

  // Stickers State
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [draggedStickerId, setDraggedStickerId] = useState<string | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // History State
  // History State
  interface LayerData {
    id: string;
    dataUrl: string;
  }

  interface HistoryItem {
    id: string;
    thumbnail: string;
    timestamp: number;
    // Full State for Restoration
    template: DrawingTemplate;
    stickers: Sticker[];
    layers: Layer[];
    layerImages: LayerData[];
  }
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Ref to hold restored images pending draw
  const restoredImagesRef = useRef<LayerData[] | null>(null);

  // Dirty State (Has the user made changes?)
  const [isDirty, setIsDirty] = useState(false);

  // UI State - Active Panel
  const [activePanel, setActivePanel] = useState<'none' | 'templates' | 'layers' | 'ruler' | 'stamps' | 'history'>(
    window.innerWidth > 900 ? 'templates' : 'none'
  );

  // Auto-Exit Stamp Tool when Panel Closes
  useEffect(() => {
    if (activePanel !== 'stamps' && tool === 'stamp') {
      setTool('brush');
    }
  }, [activePanel, tool]);

  // Canvas Navigation State
  const [viewState, setViewState] = useState({ scale: 1, offset: { x: 0, y: 0 } });
  const [isPanning, setIsPanning] = useState(false);

  // Grid State
  const [gridOpacity, setGridOpacity] = useState(0.1);
  const [gridScale, setGridScale] = useState(50);



  // Helper: Compose current canvas state to DataURL
  const composeCanvas = (): string | null => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 600);

    // Draw Layers
    layers.forEach((layer) => {
      if (!layer.visible) return;
      // Robust selection using unique IDs
      const wrapper = document.getElementById(`layer-wrapper-${layer.id}`);
      const layerCanvas = wrapper?.querySelector('canvas') as HTMLCanvasElement;

      if (layerCanvas) {
        ctx.drawImage(layerCanvas, 0, 0);
      }
    });

    // Draw Stickers
    stickers.forEach(sticker => {
      ctx.save();
      ctx.translate(sticker.x, sticker.y);
      ctx.rotate(sticker.rotation);
      ctx.font = `${sticker.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sticker.emoji, 0, 0);
      ctx.restore();
    });

    return canvas.toDataURL();
  };

  const captureHistoryState = (): HistoryItem | null => {
    if (!loadedTemplate || layers.length === 0) return null;

    console.log('Capturing History State...');
    const snapshot = composeCanvas();
    if (!snapshot) return null;

    const layerImages: LayerData[] = [];
    layers.forEach(layer => {
      const wrapper = document.getElementById(`layer-wrapper-${layer.id}`);
      const cvs = wrapper?.querySelector('canvas') as HTMLCanvasElement;
      if (cvs) {
        layerImages.push({
          id: layer.id,
          dataUrl: cvs.toDataURL()
        });
      }
    });

    return {
      id: Date.now().toString(),
      thumbnail: snapshot,
      timestamp: Date.now(),
      template: loadedTemplate,
      stickers: [...stickers],
      layers: [...layers],
      layerImages: layerImages
    };
  };

  const loadTemplate = (template: DrawingTemplate) => {
    // 1. Save History (Only if dirty)
    if (layers.length > 0 && loadedTemplate && isDirty) {
      const historyItem = captureHistoryState();
      if (historyItem) {
        setHistory(prev => [historyItem, ...prev].slice(0, 10));
      }
    }

    // 2. Clear & Load New
    setStickers([]);
    setIsDirty(false); // Reset dirty flag

    const newLayers: Layer[] = template.layers.map((tl, index) => ({
      id: `${template.id}-${index}`,
      name: tl.name,
      visible: true,
      icon: tl.icon,
      locked: tl.locked,
      zIndex: tl.zIndex ?? index,
      lockAlpha: true
    }));

    setLayers(newLayers);
    const firstSelectable = newLayers.find(l => !l.locked && (l.zIndex ?? 0) < 900);
    setActiveLayerId(firstSelectable?.id || '');
    setLoadedTemplate(template);
    initializedRefs.current.clear();
    restoredImagesRef.current = null; // Ensure no pending restore

    // Auto-Recenter
    const padding = 40;
    const availableWidth = window.innerWidth;
    const availableHeight = window.innerHeight;
    const scaleX = (availableWidth - padding * 2) / 800;
    const scaleY = (availableHeight - padding * 2) / 600;
    const isMobile = window.innerWidth <= 900;
    const zoomMultiplier = isMobile ? 1.4 : 1.15;
    const newScale = Math.min(Math.min(scaleX, scaleY) * zoomMultiplier, 3.0);

    setViewState({ scale: newScale, offset: { x: 0, y: 0 } });

    if (isMobile) setActivePanel('none');
  };

  const restoreHistory = (item: HistoryItem) => {
    // 1. Save CURRENT state if dirty
    if (layers.length > 0 && loadedTemplate && isDirty) {
      const currentItem = captureHistoryState();
      if (currentItem) {
        setHistory(prev => [currentItem, ...prev].slice(0, 10));
      }
    }

    // 2. Restore State
    setLoadedTemplate(item.template);
    setLayers(item.layers);
    setStickers(item.stickers);

    setIsDirty(false); // Reset dirty flag (loaded state is "clean")

    // Queue images for drawing
    restoredImagesRef.current = item.layerImages;
    initializedRefs.current.clear(); // Force redraw (but we will intercept with restored images)

    const firstSelectable = item.layers.find(l => !l.locked && (l.zIndex ?? 0) < 900);
    setActiveLayerId(firstSelectable?.id || '');

    if (window.innerWidth <= 900) setActivePanel('none');
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

        // Robust ID selection
        const wrapper = document.getElementById(`layer-wrapper-${layer.id}`);
        const canvas = wrapper?.querySelector('canvas') as HTMLCanvasElement;

        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, 800, 600);

            // CHECK FOR RESTORATION
            const restoredData = restoredImagesRef.current?.find(r => r.id === layer.id);
            if (restoredData) {
              const img = new Image();
              img.onload = () => {
                ctx.drawImage(img, 0, 0);
                initializedRefs.current.add(layer.id);
              };
              img.src = restoredData.dataUrl;
            } else {
              // FALLBACK TO TEMPLATE DEFAULT
              // Only if we don't have restored data (or this layer is new/untracked)
              // Match by index as per loadTemplate logic
              const tLayerByIndex = loadedTemplate.layers[index];

              if (tLayerByIndex && tLayerByIndex.drawFn) {
                tLayerByIndex.drawFn(ctx, 800, 600);
                initializedRefs.current.add(layer.id);
              }
            }
          }
        }
      });
      // After processing all layers, if we were restoring, maybe clear the ref?
      // But images load async. Let's keep it harmlessly until next load clears it.
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

  // Color Memory Logic

  // Track previous layer to save color on exit


  // 2. When color changes explicitely, save it to the ACTIVE layer immediately
  useEffect(() => {
    if (!activeLayerId) return;
    setLayers(prevLayers =>
      prevLayers.map(l =>
        l.id === activeLayerId ? { ...l, lastColor: color } : l
      )
    );
  }, [color]);

  // STAMP MODE: Auto-deselect layers
  useEffect(() => {
    if (tool === 'stamp') {
      setActiveLayerId('');
    }
  }, [tool]);


  const handleSave = () => {
    const dataUrl = composeCanvas();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = `my-drawing-${Date.now()}.png`;
    link.href = dataUrl;
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

            {/* Stamps */}
            {activePanel === 'stamps' && (
              <div className="panel-content">
                <h3 className="panel-title">Stamps <button className="close-btn" onClick={() => setActivePanel('none')}>✖</button></h3>
                <StampsPanel
                  currentStamp={currentStamp}
                  onSelectStamp={(stamp) => {
                    setCurrentStamp(stamp);
                    setTool('stamp');
                    // Selecting a stamp doesn't change canvas yet, 
                    // but clicking canvas will. 
                    // Let's handle the canvas click for stamps below.
                  }}
                />
              </div>
            )}

            {/* History Gallery */}
            {activePanel === 'history' && (
              <div className="panel-content">
                <h3 className="panel-title">History <button className="close-btn" onClick={() => setActivePanel('none')}>✖</button></h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', padding: '10px' }}>
                  {history.length === 0 && <p style={{ color: '#888', gridColumn: '1/-1', textAlign: 'center' }}>No history yet. Draw something and switch templates! 🎨</p>}
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => restoreHistory(item)} // Connect Restoration
                      style={{ border: '2px solid #eee', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.1s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      title={`Restore ${new Date(item.timestamp).toLocaleTimeString()}`}
                    >
                      <img src={item.thumbnail} alt="History" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                  ))}
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
            return;
          }

          // Calculate world coordinates
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

          const scaleX = 800 / rect.width;
          const scaleY = 600 / rect.height;
          const x = (e.clientX - rect.left) * scaleX;
          const y = (e.clientY - rect.top) * scaleY;


          // 1. EYEDROPPER LOGIC (Moved to MouseDown)
          if (tool === 'eyedropper') {
            const sortedLayers = [...layers].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)).reverse();

            let found = false;
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
                  found = true;
                  break;
                }
              } catch (err) { console.error(err); }
            }
            if (!found) {
              setColor('#ffffff');
              setTool('brush');
            }
            return;
          }

          // 2. LAYER AUTO-SELECTION (Hit Testing on MouseDown)
          // Find the topmost visible, unlocked layer at this position
          let clickedLayerId = null;
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
                clickedLayerId = layer.id;
                break;
              }
            } catch (err) { }
          }

          // Auto-select the clicked layer
          // We select immediately on MouseDown so the subsequent drawing (Drag) works on the new layer.
          if (clickedLayerId && clickedLayerId !== activeLayerId) {
            setActiveLayerId(clickedLayerId);
            // Note: Changing active layer usually disables the previous layer's CanvasLayer 
            // and enables the new one. The new one will catch the NEXT pointer event.
            // But for THIS event, it might already be consumed or bubbling.
            // Ideally, user clicks (selects) then drags (draws) or clicks again.
            // Just selecting is enough for "updating selection position".
          }
          else if (!clickedLayerId && tool === 'brush') {
            // Clicked empty space? Deselect? 
            // Usually we keep the active layer?
            // The original logic deselected if nothing was hit.
            setActiveLayerId('');
          }

          // 3. STAMPS
          if (tool === 'stamp' && !isSpacePressed) {
            const newSticker: Sticker = {
              id: Date.now().toString(),
              emoji: currentStamp,
              x, y,
              size: 100,
              rotation: 0
            };
            setStickers(prev => [...prev, newSticker]);
            setIsDirty(true);
          }
          // 4. FILL
          else if (tool === 'fill' && !isSpacePressed) {
            // Handle Fill
            const activeWrapper = document.getElementById(`layer-wrapper-${activeLayerId}`);
            const activeCanvas = activeWrapper?.querySelector('canvas');
            if (activeCanvas) {
              const ctx = activeCanvas.getContext('2d');
              if (ctx) {
                const rect = activeCanvas.getBoundingClientRect();
                // We already calculated x/y relative to 800x600, let's just use them.
                // Wait, we need integer coords.
                const ix = Math.floor(x);
                const iy = Math.floor(y);

                const filled = floodFill(ctx, ix, iy, color, 800, 600);
                if (filled) setIsDirty(true);
              }
            }
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

        // Sticker Drag Move (Attached to workspace to catch fast moves)
        onMouseMoveCapture={(e) => {
          if (draggedStickerId) {
            const referenceCanvas = document.querySelector('canvas');
            if (!referenceCanvas) return;
            const rect = referenceCanvas.getBoundingClientRect();
            const scaleX = 800 / rect.width;
            const scaleY = 600 / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            setStickers(prev => prev.map(s =>
              s.id === draggedStickerId ? { ...s, x, y } : s
            ));
          }
        }}

        onMouseUpCapture={() => {
          if (draggedStickerId) {
            // Check if dropped outside bounds to delete
            setStickers(prev => prev.filter(s => {
              if (s.id === draggedStickerId) {
                const isOutside = s.x < -50 || s.x > 850 || s.y < -50 || s.y > 650; // generous buffer before delete? Or strict?
                // Let's settle on: If center is outside 0-800/0-600.
                const outside = s.x < 0 || s.x > 800 || s.y < 0 || s.y > 600;
                return !outside; // Keep if inside
              }
              return true;
            }));
            setDraggedStickerId(null);
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
              id={`layer-wrapper-${layer.id}`}
              className={`layer-wrapper ${layer.id === activeLayerId ? 'active' : ''}`}
              style={{ zIndex: layer.zIndex ?? 0, display: layer.visible ? 'block' : 'none' }}
            >
              <CanvasLayer
                width={800}
                height={600}
                color={layer.id === activeLayerId ? color : 'transparent'}
                lineWidth={brushSize}
                tool={tool === 'eyedropper' || tool === 'fill' || tool === 'stamp' ? undefined : tool}
                lockAlpha={layer.lockAlpha ?? false}
                className="drawing-layer"
                disabled={layer.id !== activeLayerId || layer.locked || tool === 'eyedropper' || tool === 'fill' || tool === 'stamp'}
                onDrawEnd={() => setIsDirty(true)}
              />
            </div>
          ))}

          {/* DRAGGABLE STICKERS OVERLAY */}
          {stickers.map(sticker => {
            const isOutside = sticker.x < 0 || sticker.x > 800 || sticker.y < 0 || sticker.y > 600;
            return (
              <div
                key={sticker.id}
                style={{
                  position: 'absolute',
                  left: sticker.x,
                  top: sticker.y,
                  transform: `translate(-50%, -50%) rotate(${sticker.rotation}rad) ${isOutside ? 'scale(0.8)' : 'scale(1)'}`,
                  fontSize: `${sticker.size}px`,
                  cursor: tool === 'stamp' ? 'move' : 'default',
                  userSelect: 'none',
                  zIndex: 2000,
                  pointerEvents: tool === 'stamp' ? 'auto' : 'none',
                  opacity: isOutside ? 0.5 : 1,
                  filter: isOutside ? 'grayscale(100%)' : 'none',
                  transition: 'transform 0.2s, opacity 0.2s, filter 0.2s',
                }}
                onMouseDown={(e) => {
                  e.stopPropagation(); // Prevent canvas drawing
                  if (e.button !== 0) return;
                  setDraggedStickerId(sticker.id);
                  setIsDirty(true); // Mark dirty on drag start (assumes movement, or at least interaction)
                }}
              >
                {sticker.emoji}
                {isOutside && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '2rem', pointerEvents: 'none' }}>🗑️</div>}
              </div>
            );
          })}

        </div>
      </div>
    </div >
  );
}

export default App;
