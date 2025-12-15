import type { DrawingTemplate } from "../types/template";

export const TEMPLATES: DrawingTemplate[] = [
    {
        id: 'flower',
        name: 'Big Flower',
        icon: '🌻',
        layers: [
            {
                name: 'Stem',
                icon: '🌿',
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
                zIndex: 0,
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
        icon: '🐱',
        layers: [
            {
                name: 'Ears',
                icon: '👂',
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
                name: 'Face Base',
                icon: '😺',
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
                name: 'Eyes',
                icon: '👀',
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    // Whites of eyes
                    ctx.beginPath(); ctx.ellipse(cx - 50, cy - 40, 12, 20, 0, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.ellipse(cx + 50, cy - 40, 12, 20, 0, 0, Math.PI * 2); ctx.fill();
                }
            },
            {
                name: 'Mouth Area',
                icon: '�',
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
                name: 'Nose',
                icon: '�',
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.moveTo(cx - 15, cy + 10);
                    ctx.lineTo(cx + 15, cy + 10);
                    ctx.lineTo(cx, cy + 25);
                    ctx.fill();
                }
            },
            {
                name: 'Outlines',
                icon: '✏️',
                zIndex: 0,
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
                    ctx.fillStyle = '#000'; // Pupil default (can be painted over)
                    // Actually, let's make pupils outlines so they can be filled? 
                    // No, usually pupils are black. Let's keep outline simple.
                    ctx.beginPath(); ctx.ellipse(cx - 50, cy - 40, 12, 20, 0, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.ellipse(cx + 50, cy - 40, 12, 20, 0, 0, Math.PI * 2); ctx.stroke();

                    // Nose
                    ctx.beginPath();
                    ctx.moveTo(cx - 15, cy + 10);
                    ctx.lineTo(cx + 15, cy + 10);
                    ctx.lineTo(cx, cy + 25);
                    ctx.closePath();
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
        icon: '🤖',
        layers: [
            {
                name: 'Body',
                icon: '🤖',
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
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(cx - 70, cy - 160, 140, 120);
                }
            },
            {
                name: 'Arms',
                icon: '🦾',
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    // Left Arm
                    ctx.beginPath();
                    ctx.moveTo(cx - 80, cy + 20); ctx.bezierCurveTo(cx - 120, cy + 60, cx - 120, cy + 100, cx - 80, cy + 140);
                    // Thick stroke simulation for fill? Or just simple lines?
                    // Let's create a thicker path to fill
                    ctx.lineTo(cx - 60, cy + 140); // Close loop roughly
                    ctx.bezierCurveTo(cx - 100, cy + 100, cx - 100, cy + 60, cx - 80, cy + 40);
                    ctx.fill();

                    // Right Arm
                    ctx.beginPath();
                    ctx.moveTo(cx + 80, cy + 20); ctx.bezierCurveTo(cx + 120, cy + 60, cx + 120, cy + 100, cx + 80, cy + 140);
                    ctx.lineTo(cx + 60, cy + 140);
                    ctx.bezierCurveTo(cx + 100, cy + 100, cx + 100, cy + 60, cx + 80, cy + 40);
                    ctx.fill();
                }
            },
            {
                name: 'Antennae',
                icon: '📡',
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    // Antennae balls
                    ctx.beginPath(); ctx.arc(cx - 60, cy - 220, 8, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(cx + 60, cy - 220, 8, 0, Math.PI * 2); ctx.fill();
                    // Sticks
                    ctx.beginPath();
                    ctx.moveTo(cx - 40, cy - 160); ctx.lineTo(cx - 60, cy - 220); ctx.lineTo(cx - 55, cy - 220); ctx.lineTo(cx - 35, cy - 160);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(cx + 40, cy - 160); ctx.lineTo(cx + 60, cy - 220); ctx.lineTo(cx + 55, cy - 220); ctx.lineTo(cx + 35, cy - 160);
                    ctx.fill();
                }
            },
            {
                name: 'Screen',
                icon: '📺',
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(cx - 50, cy - 130, 100, 60);
                }
            },
            {
                name: 'Outlines',
                zIndex: 0,
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
        icon: '🍕',
        layers: [
            {
                name: 'Crust',
                icon: '🍕',
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
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    // Pepperonis - better spacing
                    ctx.beginPath(); ctx.arc(cx - 30, cy - 60, 20, 0, Math.PI * 2); ctx.fill(); // Top left
                    ctx.beginPath(); ctx.arc(cx + 40, cy - 40, 22, 0, Math.PI * 2); ctx.fill(); // Top right
                    ctx.beginPath(); ctx.arc(cx + 10, cy + 50, 20, 0, Math.PI * 2); ctx.fill(); // Bottom
                    ctx.beginPath(); ctx.arc(cx - 20, cy + 10, 18, 0, Math.PI * 2); ctx.fill(); // Middle
                }
            },
            {
                name: 'Outlines',
                zIndex: 0,
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
                    ctx.beginPath(); ctx.arc(cx - 30, cy - 60, 20, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(cx + 40, cy - 40, 22, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(cx + 10, cy + 50, 20, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(cx - 20, cy + 10, 18, 0, Math.PI * 2); ctx.stroke();
                }
            }
        ]
    },
    {
        id: 'butterfly',
        name: 'Butterfly',
        icon: '🦋',
        layers: [
            {
                name: 'Bottom Wings',
                icon: '✨',
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';

                    // Left Bottom Wing
                    ctx.beginPath();
                    ctx.moveTo(cx - 10, cy + 30);
                    ctx.bezierCurveTo(cx - 60, cy + 40, cx - 90, cy + 90, cx - 50, cy + 130);
                    ctx.bezierCurveTo(cx - 20, cy + 150, cx - 10, cy + 100, cx - 10, cy + 80);
                    ctx.fill();

                    // Right Bottom Wing
                    ctx.beginPath();
                    ctx.moveTo(cx + 10, cy + 30);
                    ctx.bezierCurveTo(cx + 60, cy + 40, cx + 90, cy + 90, cx + 50, cy + 130);
                    ctx.bezierCurveTo(cx + 20, cy + 150, cx + 10, cy + 100, cx + 10, cy + 80);
                    ctx.fill();
                }
            },
            {
                name: 'Top Wings',
                icon: '🦋',
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';

                    // Left Top Wing
                    ctx.beginPath();
                    ctx.moveTo(cx - 10, cy + 10);
                    ctx.bezierCurveTo(cx - 80, cy - 60, cx - 140, cy - 60, cx - 130, cy + 20);
                    ctx.bezierCurveTo(cx - 120, cy + 80, cx - 40, cy + 60, cx - 10, cy + 30);
                    ctx.fill();

                    // Right Top Wing
                    ctx.beginPath();
                    ctx.moveTo(cx + 10, cy + 10);
                    ctx.bezierCurveTo(cx + 80, cy - 60, cx + 140, cy - 60, cx + 130, cy + 20);
                    ctx.bezierCurveTo(cx + 120, cy + 80, cx + 40, cy + 60, cx + 10, cy + 30);
                    ctx.fill();
                }
            },
            {
                name: 'Wing Spots',
                icon: '⚪',
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';

                    // Top Wing Spots
                    ctx.beginPath(); ctx.arc(cx - 90, cy - 10, 15, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(cx + 90, cy - 10, 15, 0, Math.PI * 2); ctx.fill();

                    // Bottom Wing Spots
                    ctx.beginPath(); ctx.arc(cx - 50, cy + 100, 10, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(cx + 50, cy + 100, 10, 0, Math.PI * 2); ctx.fill();
                }
            },
            {
                name: 'Body',
                icon: '�',
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';
                    // Thorax & Abdomen
                    ctx.beginPath();
                    ctx.ellipse(cx, cy + 40, 12, 60, 0, 0, Math.PI * 2);
                    ctx.fill();
                    // Head
                    ctx.beginPath();
                    ctx.arc(cx, cy - 30, 20, 0, Math.PI * 2);
                    ctx.fill();
                }
            },
            {
                name: 'Antennae',
                icon: '📡',
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.fillStyle = '#ffffff';

                    // Left
                    ctx.beginPath();
                    ctx.moveTo(cx - 10, cy - 40);
                    ctx.quadraticCurveTo(cx - 30, cy - 80, cx - 50, cy - 80);
                    ctx.lineTo(cx - 55, cy - 75); // Thickness hack/tip
                    ctx.quadraticCurveTo(cx - 35, cy - 75, cx - 15, cy - 35);
                    ctx.fill();

                    // Right
                    ctx.beginPath();
                    ctx.moveTo(cx + 10, cy - 40);
                    ctx.quadraticCurveTo(cx + 30, cy - 80, cx + 50, cy - 80);
                    ctx.lineTo(cx + 55, cy - 75);
                    ctx.quadraticCurveTo(cx + 35, cy - 75, cx + 15, cy - 35);
                    ctx.fill();
                }
            },
            {
                name: 'Outlines',
                zIndex: 0,
                locked: true,
                drawFn: (ctx, w, h) => {
                    const cx = w / 2;
                    const cy = h / 2;
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 5;
                    ctx.lineJoin = 'round';
                    ctx.lineCap = 'round';

                    // Top Wings
                    ctx.beginPath();
                    ctx.moveTo(cx - 10, cy + 10);
                    ctx.bezierCurveTo(cx - 80, cy - 60, cx - 140, cy - 60, cx - 130, cy + 20);
                    ctx.bezierCurveTo(cx - 120, cy + 80, cx - 40, cy + 60, cx - 10, cy + 30);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(cx + 10, cy + 10);
                    ctx.bezierCurveTo(cx + 80, cy - 60, cx + 140, cy - 60, cx + 130, cy + 20);
                    ctx.bezierCurveTo(cx + 120, cy + 80, cx + 40, cy + 60, cx + 10, cy + 30);
                    ctx.stroke();

                    // Bottom Wings
                    ctx.beginPath();
                    ctx.moveTo(cx - 10, cy + 30);
                    ctx.bezierCurveTo(cx - 60, cy + 40, cx - 90, cy + 90, cx - 50, cy + 130);
                    ctx.bezierCurveTo(cx - 20, cy + 150, cx - 10, cy + 100, cx - 10, cy + 80);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(cx + 10, cy + 30);
                    ctx.bezierCurveTo(cx + 60, cy + 40, cx + 90, cy + 90, cx + 50, cy + 130);
                    ctx.bezierCurveTo(cx + 20, cy + 150, cx + 10, cy + 100, cx + 10, cy + 80);
                    ctx.stroke();

                    // Spots
                    ctx.beginPath(); ctx.arc(cx - 90, cy - 10, 15, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(cx + 90, cy - 10, 15, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(cx - 50, cy + 100, 10, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(cx + 50, cy + 100, 10, 0, Math.PI * 2); ctx.stroke();

                    // Body
                    ctx.beginPath();
                    ctx.ellipse(cx, cy + 40, 12, 60, 0, 0, Math.PI * 2);
                    ctx.stroke();
                    // Head
                    ctx.beginPath();
                    ctx.arc(cx, cy - 30, 20, 0, Math.PI * 2);
                    ctx.stroke();

                    // Antennae Outline
                    ctx.beginPath();
                    ctx.moveTo(cx - 10, cy - 40);
                    ctx.quadraticCurveTo(cx - 30, cy - 80, cx - 50, cy - 80);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(cx + 10, cy - 40);
                    ctx.quadraticCurveTo(cx + 30, cy - 80, cx + 50, cy - 80);
                    ctx.stroke();
                }
            }
        ]
    },
    {
        id: 'burger',
        name: 'Giant Burger',
        icon: '🍔',
        layers: [
            {
                name: 'Bottom Bun',
                icon: '🍞',
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
                zIndex: 0,
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
                    ctx.lineTo(cx + 120, cy + 40);
                    ctx.lineTo(cx - 120, cy + 40);
                    ctx.closePath();
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
