import './Sidebar.css';

interface SidebarProps {
    activePanel: 'none' | 'templates' | 'layers' | 'ruler';
    setActivePanel: (panel: 'none' | 'templates' | 'layers' | 'ruler') => void;
}

export const Sidebar = ({ activePanel, setActivePanel }: SidebarProps) => {
    const togglePanel = (panel: 'templates' | 'layers' | 'ruler') => {
        setActivePanel(activePanel === panel ? 'none' : panel);
    };

    return (
        <div className="sidebar">
            <div className="sidebar-group">
                <button
                    className={`sidebar-btn ${activePanel === 'templates' ? 'active' : ''}`}
                    onClick={() => togglePanel('templates')}
                    title="Pictures"
                >
                    🖼️
                </button>
                <button
                    className={`sidebar-btn ${activePanel === 'layers' ? 'active' : ''}`}
                    onClick={() => togglePanel('layers')}
                    title="Layers"
                >
                    📚
                </button>
                <button
                    className={`sidebar-btn ${activePanel === 'ruler' ? 'active' : ''}`}
                    onClick={() => togglePanel('ruler')}
                    title="Ruler / Grid"
                >
                    📏
                </button>
            </div>
        </div>
    );
};
