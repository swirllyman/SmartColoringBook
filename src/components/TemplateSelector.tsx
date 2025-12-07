import { TEMPLATES } from "../data/templates";
import type { DrawingTemplate } from "../types/template";

interface TemplateSelectorProps {
    onSelect: (template: DrawingTemplate) => void;
}

export const TemplateSelector = ({ onSelect }: TemplateSelectorProps) => {
    return (
        <div className="template-selector">
            <h3>Choose a Picture</h3>
            <div className="template-grid">
                {TEMPLATES.map(t => (
                    <button
                        key={t.id}
                        className="template-card"
                        onClick={() => onSelect(t)}
                    >
                        {t.name}
                    </button>
                ))}
            </div>
        </div>
    );
};
