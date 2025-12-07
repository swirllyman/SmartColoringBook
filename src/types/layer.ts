export interface Layer {
    id: string;
    name: string;
    icon?: string;
    visible: boolean;
    locked?: boolean;
    zIndex?: number;
    lockAlpha?: boolean; // If true, strictly restricts drawing to existing pixels
    lastColor?: string; // Last used color on this layer
}

export interface LayerAction {
    type: 'ADD' | 'REMOVE' | 'TOGGLE_VISIBILITY' | 'SELECT' | 'REORDER';
    payload?: any;
}
