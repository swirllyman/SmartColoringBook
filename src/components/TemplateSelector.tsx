import { TEMPLATES } from "../data/templates";
import type { DrawingTemplate } from "../types/template";

interface TemplateSelectorProps {
    onSelect: (template: DrawingTemplate) => void;
}

export const TemplateSelector = ({ onSelect }: TemplateSelectorProps) => {
    return (
        <div className="template-selector">
            <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: '#666' }}>Pick a Picture!</h3>
            <div className="template-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '15px',
                padding: '5px'
            }}>
                {TEMPLATES.map(t => (
                    <button
                        key={t.id}
                        className="template-card"
                        onClick={() => onSelect(t)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1.5rem',
                            border: '2px solid #ddd',
                            borderRadius: '16px',
                            background: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                            gap: '10px'
                        }}
                    >
                        <span style={{ fontSize: '3rem', lineHeight: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
                            {t.icon || '📄'}
                        </span>
                        <span style={{ fontWeight: 600, color: '#333', fontSize: '1rem' }}>
                            {t.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
