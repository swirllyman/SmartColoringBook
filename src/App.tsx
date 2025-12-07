import { useState, useEffect, useRef } from 'react';
import { CanvasLayer } from './components/CanvasLayer';
import { Toolbar } from './components/Toolbar';
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

  // Tools state
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(50);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'eyedropper'>('brush');

  // UI State - Floating Panels
  // Default: Open on PC (width > 900), Closed on Mobile
  const [showTemplates, setShowTemplates] = useState(window.innerWidth > 900);
  const [showLayers, setShowLayers] = useState(window.innerWidth > 900);

  // Load default template on start
  useEffect(() => {
    loadTemplate(TEMPLATES[0]);
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

    // On mobile, auto-close template picker after selection to show canvas
    if (window.innerWidth <= 900) {
      setShowTemplates(false);
    }
  };

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
    const rect = e.currentTarget.getBoundingClientRect();
    // Logic for Scaling:
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

  return (
    <div className="app-container">

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
          showTemplates={showTemplates}
          setShowTemplates={setShowTemplates}
          showLayers={showLayers}
          setShowLayers={setShowLayers}
        />
      </div>

      {/* 2. MAIN WORKSPACE (Canvas) */}
      <div className="main-workspace">
        <div
          className={`canvas-stack ${activeLayerId ? 'focus-mode' : ''}`}
          onClick={handleCanvasClick}
          style={{ cursor: tool === 'eyedropper' ? 'crosshair' : 'default' }}
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

      {/* 3. FLOATING PANELS */}

      {/* Left Panel: Templates */}
      {showTemplates && (
        <div className="floating-panel left-panel">
          <h3 className="panel-title">Pictures <button className="close-btn" onClick={() => setShowTemplates(false)}>✖</button></h3>
          <TemplateSelector onSelect={loadTemplate} />
        </div>
      )}

      {/* Right Panel: Layers */}
      {showLayers && (
        <div className="floating-panel right-panel">
          <div className="layers-header">
            <h3>Layers</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={addLayer} className="mini-btn" title="Add Layer">➕</button>
              <button className="close-btn" onClick={() => setShowLayers(false)}>✖</button>
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

    </div>
  );
}

export default App;
