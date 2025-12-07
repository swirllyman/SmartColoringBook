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
  };

  useEffect(() => {
    if (!loadedTemplate) return;

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
    // The canvas stack might be visually smaller than 800x600.
    // logical size is fixed 800x600.
    const scaleX = 800 / rect.width;
    const scaleY = 600 / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // EYEDROPPER LOGIC
    if (tool === 'eyedropper') {
      // Scan layers top DOWN to find the first visible pixel
      // We actually need z-index sorted layers
      const sortedLayers = [...layers].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)).reverse();

      for (const layer of sortedLayers) {
        if (!layer.visible) continue;
        // We need to find the DOM index. original layers array index.
        const index = layers.findIndex(l => l.id === layer.id);
        if (index === -1) continue;

        const canvas = document.querySelector(`.layer-wrapper:nth-child(${index + 1}) canvas`) as HTMLCanvasElement;
        if (!canvas) continue;

        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        try {
          const pixel = ctx.getImageData(x, y, 1, 1).data;
          if (pixel[3] > 0) { // Not transparent
            const hexColor = `#${toHex(pixel[0])}${toHex(pixel[1])}${toHex(pixel[2])}`;
            setColor(hexColor);
            setTool('brush'); // Auto switch back
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      // If nothing hit (background), usually white
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
      <div className="left-panel">
        <TemplateSelector onSelect={loadTemplate} />
      </div>

      <div className="center-panel">
        <Toolbar
          color={color}
          setColor={setColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          tool={tool}
          setTool={setTool}
          onSave={handleSave}
        />

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
                  tool={tool === 'eyedropper' ? undefined : tool} // Disable drawing when picking
                  lockAlpha={layer.lockAlpha ?? false}
                  className="drawing-layer"
                  disabled={layer.id !== activeLayerId || layer.locked || tool === 'eyedropper'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="layers-panel">
          <div className="layers-header">
            <h3>Layers</h3>
            <button onClick={addLayer} className="mini-btn" title="Add Layer">➕</button>
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

                  {/* ALPHA LOCK TOGGLE */}
                  {!layer.locked && (
                    <span
                      onClick={(e) => toggleAlphaLock(layer.id, e)}
                      className={`action-icon ${layer.lockAlpha ? 'active' : ''}`}
                      title={layer.lockAlpha ? "Alpha Locked (Click to Unlock)" : "Alpha Unlocked (Click to Lock)"}
                      style={{ marginLeft: 'auto', opacity: layer.lockAlpha ? 1 : 0.3, cursor: 'pointer' }}
                    >
                      {layer.lockAlpha ? '🔒' : '🔓'}
                    </span>
                  )}

                  {layer.locked && <span style={{ marginLeft: 'auto' }}>🔒</span>}
                </div>
              ))}
          </div>
          <div style={{ padding: '1rem' }}>
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
      </div>
    </div>
  );
}

export default App;
