import type { DrawingTemplate } from "../types/template";

export const TEMPLATES: DrawingTemplate[] = [
    {
        id: 'flower',
        name: 'Big Flower',
        layers: [
            {
                name: 'Stem',
                icon: '🌿',
                zIndex: 0,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';

                    ctx.beginPath();
                    ctx.rect(cx - 15, cy + 60, 30, 240);
                    ctx.fill();

                    ctx.beginPath();
                    ctx.ellipse(cx + 40, cy + 150, 40, 15, Math.PI / 4, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.beginPath();
                    ctx.ellipse(cx - 40, cy + 180, 40, 15, -Math.PI / 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            },
            {
                name: 'Petals',
                icon: '🌸',
                zIndex: 1,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';

                    for (let i = 0; i < 6; i++) {
                        const angle = (i * 60 * Math.PI) / 180;
                        const px = cx + Math.cos(angle) * 110;
                        const py = cy + Math.sin(angle) * 110;
                        ctx.beginPath();
                        ctx.arc(px, py, 60, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            },
            {
                name: 'Center',
                icon: '🟡',
                zIndex: 2,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(cx, cy, 70, 0, Math.PI * 2);
                    ctx.fill();
                }
            },
            {
                name: 'Outlines',
                icon: '✏️',
                zIndex: 999,
                locked: true,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 4;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';

                    ctx.beginPath();
                    ctx.rect(cx - 15, cy + 60, 30, 240);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.ellipse(cx + 40, cy + 150, 40, 15, Math.PI / 4, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.ellipse(cx - 40, cy + 180, 40, 15, -Math.PI / 4, 0, Math.PI * 2);
                    ctx.stroke();

                    for (let i = 0; i < 6; i++) {
                        const angle = (i * 60 * Math.PI) / 180;
                        const px = cx + Math.cos(angle) * 110;
                        const py = cy + Math.sin(angle) * 110;
                        ctx.beginPath();
                        ctx.arc(px, py, 60, 0, Math.PI * 2);
                        ctx.stroke();
                    }

                    ctx.beginPath();
                    ctx.arc(cx, cy, 70, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        ]
    },
    {
        id: 'kitty_face',
        name: 'Kitty Face',
        layers: [
            {
                name: 'Ears',
                icon: '👂',
                zIndex: 0,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';

                    ctx.beginPath();
                    ctx.moveTo(cx - 120, cy - 80);
                    ctx.lineTo(cx - 140, cy - 180);
                    ctx.lineTo(cx - 60, cy - 140);
                    ctx.fill();

                    ctx.beginPath();
                    ctx.moveTo(cx + 120, cy - 80);
                    ctx.lineTo(cx + 140, cy - 180);
                    ctx.lineTo(cx + 60, cy - 140);
                    ctx.fill();
                }
            },
            {
                name: 'Face',
                icon: '😺',
                zIndex: 1,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.ellipse(cx, cy - 20, 140, 120, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            },
            {
                name: 'Mouth',
                icon: '👄',
                zIndex: 2,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.ellipse(cx, cy + 40, 40, 30, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            },
            {
                name: 'Outlines',
                icon: '✏️',
                zIndex: 999,
                locked: true,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 5;
                    ctx.lineJoin = 'round';
                    ctx.lineCap = 'round';

                    // Ears
                    ctx.beginPath();
                    ctx.moveTo(cx - 120, cy - 80);
                    ctx.lineTo(cx - 140, cy - 180);
                    ctx.lineTo(cx - 60, cy - 140);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(cx + 120, cy - 80);
                    ctx.lineTo(cx + 140, cy - 180);
                    ctx.lineTo(cx + 60, cy - 140);
                    ctx.stroke();

                    // Face
                    ctx.beginPath();
                    ctx.ellipse(cx, cy - 20, 140, 120, 0, 0, Math.PI * 2);
                    ctx.stroke();

                    // Eyes
                    ctx.fillStyle = '#000';
                    ctx.beginPath(); ctx.ellipse(cx - 50, cy - 40, 12, 20, 0, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.ellipse(cx + 50, cy - 40, 12, 20, 0, 0, Math.PI * 2); ctx.fill();

                    // Nose
                    ctx.fillStyle = '#ffaaaa';
                    ctx.beginPath();
                    ctx.moveTo(cx - 15, cy + 10);
                    ctx.lineTo(cx + 15, cy + 10);
                    ctx.lineTo(cx, cy + 25);
                    ctx.fill();
                    ctx.stroke();

                    // Whiskers
                    ctx.beginPath();
                    ctx.moveTo(cx - 80, cy + 20); ctx.lineTo(cx - 180, cy + 10);
                    ctx.moveTo(cx - 80, cy + 30); ctx.lineTo(cx - 180, cy + 40);
                    ctx.moveTo(cx + 80, cy + 20); ctx.lineTo(cx + 180, cy + 10);
                    ctx.moveTo(cx + 80, cy + 30); ctx.lineTo(cx + 180, cy + 40);
                    ctx.stroke();

                    // Mouth line
                    ctx.beginPath();
                    ctx.moveTo(cx, cy + 25);
                    ctx.lineTo(cx, cy + 50);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(cx - 15, cy + 50, 15, 0, Math.PI, false);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(cx + 15, cy + 50, 15, 0, Math.PI, false);
                    ctx.stroke();
                }
            }
        ]
    },
    {
        id: 'robot',
        name: 'Robot',
        layers: [
            {
                name: 'Body',
                icon: '🤖',
                zIndex: 0,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(cx - 80, cy - 20, 160, 180);
                }
            },
            {
                name: 'Head',
                icon: '🖥️',
                zIndex: 1,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(cx - 70, cy - 160, 140, 120);
                }
            },
            {
                name: 'Screen',
                icon: '📺',
                zIndex: 2,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(cx - 50, cy - 130, 100, 60);
                }
            },
            {
                name: 'Outlines',
                zIndex: 999,
                locked: true,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 5;

                    // Head
                    ctx.strokeRect(cx - 70, cy - 160, 140, 120);

                    // Antennas
                    ctx.beginPath();
                    ctx.moveTo(cx - 40, cy - 160); ctx.lineTo(cx - 60, cy - 220);
                    ctx.moveTo(cx + 40, cy - 160); ctx.lineTo(cx + 60, cy - 220);
                    ctx.stroke();
                    ctx.beginPath(); ctx.arc(cx - 60, cy - 220, 8, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(cx + 60, cy - 220, 8, 0, Math.PI * 2); ctx.stroke();

                    // Body
                    ctx.strokeRect(cx - 80, cy - 20, 160, 180);

                    // Arms
                    ctx.beginPath();
                    ctx.moveTo(cx - 80, cy + 20); ctx.bezierCurveTo(cx - 120, cy + 60, cx - 120, cy + 100, cx - 80, cy + 140);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(cx + 80, cy + 20); ctx.bezierCurveTo(cx + 120, cy + 60, cx + 120, cy + 100, cx + 80, cy + 140);
                    ctx.stroke();

                    // Screen
                    ctx.strokeRect(cx - 50, cy - 130, 100, 60);

                    // Buttons
                    ctx.beginPath(); ctx.arc(cx - 30, cy + 40, 10, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(cx, cy + 40, 10, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(cx + 30, cy + 40, 10, 0, Math.PI * 2); ctx.stroke();
                }
            }
        ]
    },
    {
        id: 'pizza',
        name: 'Pizza Slice',
        layers: [
            {
                name: 'Crust',
                icon: '🍕',
                zIndex: 0,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    // Match the outline shape perfectly
                    ctx.beginPath();
                    ctx.moveTo(cx - 100, cy - 100);
                    ctx.quadraticCurveTo(cx, cy - 160, cx + 100, cy - 100);
                    ctx.lineTo(cx, cy + 150);
                    ctx.closePath();
                    ctx.fill();
                }
            },
            {
                name: 'Toppings',
                icon: '🍄',
                zIndex: 1,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    // Pepperonis
                    ctx.beginPath(); ctx.arc(cx - 40, cy - 80, 20, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(cx + 50, cy - 50, 22, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(cx - 10, cy + 20, 18, 0, Math.PI * 2); ctx.fill();
                }
            },
            {
                name: 'Outlines',
                zIndex: 999,
                locked: true,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 5;
                    ctx.lineJoin = 'round';

                    // Slice shape
                    ctx.beginPath();
                    ctx.moveTo(cx - 100, cy - 100);
                    ctx.quadraticCurveTo(cx, cy - 160, cx + 100, cy - 100);
                    ctx.lineTo(cx, cy + 150);
                    ctx.closePath();
                    ctx.stroke();

                    // Crust line
                    ctx.beginPath();
                    ctx.moveTo(cx - 100, cy - 100);
                    ctx.quadraticCurveTo(cx, cy - 60, cx + 100, cy - 100);
                    ctx.stroke();

                    // Pepperoni outlines
                    ctx.beginPath(); ctx.arc(cx - 40, cy - 80, 20, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(cx + 50, cy - 50, 22, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(cx - 10, cy + 20, 18, 0, Math.PI * 2); ctx.stroke();
                }
            }
        ]
    },
    {
        id: 'butterfly',
        name: 'Butterfly',
        layers: [
            {
                name: 'Top Wings',
                icon: '🦋',
                zIndex: 0,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.ellipse(cx - 60, cy - 60, 80, 60, -Math.PI / 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.ellipse(cx + 60, cy - 60, 80, 60, Math.PI / 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            },
            {
                name: 'Bottom Wings',
                icon: '✨',
                zIndex: 1,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.ellipse(cx - 50, cy + 60, 60, 50, Math.PI / 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.ellipse(cx + 50, cy + 60, 60, 50, -Math.PI / 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            },
            {
                name: 'Body',
                icon: '🐛',
                zIndex: 2,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.ellipse(cx, cy, 15, 100, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            },
            {
                name: 'Outlines',
                zIndex: 999,
                locked: true,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 4;

                    // Wings
                    ctx.beginPath();
                    ctx.ellipse(cx - 60, cy - 60, 80, 60, -Math.PI / 4, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.ellipse(cx + 60, cy - 60, 80, 60, Math.PI / 4, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.ellipse(cx - 50, cy + 60, 60, 50, Math.PI / 4, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.ellipse(cx + 50, cy + 60, 60, 50, -Math.PI / 4, 0, Math.PI * 2);
                    ctx.stroke();

                    // Body
                    ctx.beginPath();
                    ctx.ellipse(cx, cy, 15, 100, 0, 0, Math.PI * 2);
                    ctx.stroke();

                    // Antennae
                    ctx.beginPath();
                    ctx.moveTo(cx - 5, cy - 90); ctx.quadraticCurveTo(cx - 20, cy - 130, cx - 40, cy - 130);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(cx + 5, cy - 90); ctx.quadraticCurveTo(cx + 20, cy - 130, cx + 40, cy - 130);
                    ctx.stroke();
                }
            }
        ]
    },
    {
        id: 'burger',
        name: 'Giant Burger',
        layers: [
            {
                name: 'Bottom Bun',
                icon: '🍞',
                zIndex: 0,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.rect(cx - 100, cy + 120, 200, 40);
                    ctx.fill();
                }
            },
            {
                name: 'Patty',
                icon: '🥩',
                zIndex: 1,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.rect(cx - 110, cy + 80, 220, 40);
                    ctx.fill();
                }
            },
            {
                name: 'Cheese',
                icon: '🧀',
                zIndex: 2,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.rect(cx - 115, cy + 60, 230, 20);
                    // Drips
                    ctx.rect(cx - 80, cy + 80, 20, 20);
                    ctx.rect(cx + 40, cy + 80, 20, 15);
                    ctx.fill();
                }
            },
            {
                name: 'Lettuce',
                icon: '🥬',
                zIndex: 3,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.moveTo(cx - 120, cy + 60);
                    for (let i = 0; i < 10; i++) {
                        ctx.quadraticCurveTo(cx - 120 + i * 24 + 12, cy + 80, cx - 120 + (i + 1) * 24, cy + 60);
                    }
                    ctx.lineTo(cx + 120, cy + 40);
                    ctx.lineTo(cx - 120, cy + 40);
                    ctx.fill();
                }
            },
            {
                name: 'Tomato',
                icon: '🍅',
                zIndex: 4,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.rect(cx - 100, cy + 10, 200, 30);
                    ctx.fill();
                }
            },
            {
                name: 'Top Bun',
                icon: '🥯',
                zIndex: 5,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(cx, cy + 10, 110, Math.PI, 0);
                    ctx.lineTo(cx + 110, cy + 10);
                    ctx.fill();
                }
            },
            {
                name: 'Outlines',
                zIndex: 999,
                locked: true,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 5;
                    ctx.lineJoin = 'round';

                    // Bottom
                    ctx.strokeRect(cx - 100, cy + 120, 200, 40);
                    // Patty
                    ctx.strokeRect(cx - 110, cy + 80, 220, 40);
                    // Drips outline
                    ctx.beginPath();
                    ctx.rect(cx - 115, cy + 60, 230, 20);
                    ctx.stroke();

                    // Lettuce
                    ctx.beginPath();
                    ctx.moveTo(cx - 120, cy + 60);
                    for (let i = 0; i < 10; i++) {
                        ctx.quadraticCurveTo(cx - 120 + i * 24 + 12, cy + 80, cx - 120 + (i + 1) * 24, cy + 60);
                    }
                    ctx.stroke();

                    // Tomato
                    ctx.strokeRect(cx - 100, cy + 10, 200, 30);

                    // Top Bun
                    ctx.beginPath();
                    ctx.arc(cx, cy + 10, 110, Math.PI, 0);
                    ctx.closePath();
                    ctx.stroke();

                    // Seeds
                    ctx.beginPath(); ctx.ellipse(cx - 40, cy - 40, 5, 2, 0.5, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.ellipse(cx + 20, cy - 60, 5, 2, -0.2, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.ellipse(cx + 60, cy - 30, 5, 2, 0.8, 0, Math.PI * 2); ctx.stroke();
                }
            }
        ]
    }
];
