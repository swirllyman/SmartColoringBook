
interface StampsPanelProps {
    onSelectStamp: (stamp: string) => void;
    currentStamp: string;
}

const STAMPS = [
    '⭐', '❤️', '🎈', '🌸', '🦋',
    '🐶', '🐱', '🦄', '🦕', '🐸',
    '🥕', '🍎', '🍕', '🍦', '🍩',
    '🚗', '✈️', '🚀', '⚽', '🎨'
];

export const StampsPanel = ({ onSelectStamp, currentStamp }: StampsPanelProps) => {
    return (
        <div className="stamps-panel">
            <h3 className="panel-title" style={{ textAlign: 'center', marginBottom: '1rem' }}>Stamps</h3>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '10px'
            }}>
                {STAMPS.map(stamp => (
                    <button
                        key={stamp}
                        onClick={() => onSelectStamp(stamp)}
                        style={{
                            fontSize: '2rem',
                            padding: '10px',
                            background: currentStamp === stamp ? '#e0f0ff' : 'white',
                            border: currentStamp === stamp ? '2px solid #007bff' : '2px solid transparent',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        {stamp}
                    </button>
                ))}
            </div>
        </div>
    );
};
