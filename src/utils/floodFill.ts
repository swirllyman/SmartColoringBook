
export function floodFill(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    fillColorHex: string,
    width: number,
    height: number
) {
    // 1. Get Image Data
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // 2. Parse Fill Color
    const r = parseInt(fillColorHex.slice(1, 3), 16);
    const g = parseInt(fillColorHex.slice(3, 5), 16);
    const b = parseInt(fillColorHex.slice(5, 7), 16);
    const fillColor = { r, g, b, a: 255 };

    // 3. Get Target Color
    const targetIdx = (Math.floor(startY) * width + Math.floor(startX)) * 4;
    const targetColor = {
        r: data[targetIdx],
        g: data[targetIdx + 1],
        b: data[targetIdx + 2],
        a: data[targetIdx + 3]
    };

    // 4. Early Exit if colors match
    if (
        Math.abs(targetColor.r - fillColor.r) < 3 &&
        Math.abs(targetColor.g - fillColor.g) < 3 &&
        Math.abs(targetColor.b - fillColor.b) < 3 &&
        Math.abs(targetColor.a - fillColor.a) < 3
    ) {
        return;
    }

    // 5. Scanline Algorithm
    const stack = [[Math.floor(startX), Math.floor(startY)]];

    // Safety break
    let iterations = 0;
    const maxIterations = width * height;

    while (stack.length > 0 && iterations < maxIterations) {
        iterations++;
        const point = stack.pop();
        if (!point) continue;

        let x = point[0];
        let y = point[1];

        let idx = (y * width + x) * 4;

        // Move Up to find top of span
        while (y >= 0 && match(idx, targetColor, data)) {
            y--;
            idx -= width * 4;
        }
        y++; // Step back down to first valid pixel
        idx += width * 4;

        let spanLeft = false;
        let spanRight = false;

        // Move Down filling span
        while (y < height && match(idx, targetColor, data)) {
            // Fill Pixel
            data[idx] = fillColor.r;
            data[idx + 1] = fillColor.g;
            data[idx + 2] = fillColor.b;
            data[idx + 3] = fillColor.a;

            // Check Left
            if (x > 0) {
                if (match(idx - 4, targetColor, data)) {
                    if (!spanLeft) {
                        stack.push([x - 1, y]);
                        spanLeft = true;
                    }
                } else if (spanLeft) {
                    spanLeft = false;
                }
            }

            // Check Right
            if (x < width - 1) {
                if (match(idx + 4, targetColor, data)) {
                    if (!spanRight) {
                        stack.push([x + 1, y]);
                        spanRight = true;
                    }
                } else if (spanRight) {
                    spanRight = false;
                }
            }

            y++;
            idx += width * 4;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function match(idx: number, target: { r: number, g: number, b: number, a: number }, data: Uint8ClampedArray) {
    // Simple tolerance check
    const tol = 30; // High tolerance for compression artifacts or varying line colors
    return (
        Math.abs(data[idx] - target.r) <= tol &&
        Math.abs(data[idx + 1] - target.g) <= tol &&
        Math.abs(data[idx + 2] - target.b) <= tol &&
        Math.abs(data[idx + 3] - target.a) <= tol // Alpha must match well
    );
}
