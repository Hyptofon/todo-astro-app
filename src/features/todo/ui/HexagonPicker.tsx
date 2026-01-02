import React, { useMemo } from 'react';

interface HexagonPickerProps {
    onSelect: (color: string) => void;
    selectedColor: string;
}

export const HexagonPicker = React.memo(({ onSelect, selectedColor }: HexagonPickerProps) => {
    const hexRadius = 10;
    const hexWidth = Math.sqrt(3) * hexRadius;
    const hexHeight = 2 * hexRadius;
    const layers = 8;
    const padding = hexRadius * 2;
    const svgWidth = (layers * 2 + 1) * hexWidth + padding;
    const svgHeight = (layers * 2 + 1) * hexHeight * 0.75 + padding;

    const hexagons = useMemo(() => {
        const items = [];
        items.push({ x: 0, y: 0, color: '#ffffff' });

        for (let q = -layers; q <= layers; q++) {
            for (let r = -layers; r <= layers; r++) {
                const s = -q - r;
                const radius = Math.max(Math.abs(q), Math.abs(r), Math.abs(s));
                if (radius === 0 || radius > layers) continue;
                const x = (q * hexWidth) + (r * hexWidth / 2);
                const y = (r * hexHeight * 0.75);
                const angle = (Math.atan2(y, x) * 180) / Math.PI;
                const hue = angle < 0 ? angle + 360 : angle;
                let saturation = (radius / layers) * 100;
                let lightness = 50;
                if (radius < 3) {
                    lightness = 100 - (radius * 10);
                    saturation = radius * 20;
                } else if (radius > layers - 2) {
                    lightness = 50 - ((radius - (layers - 2)) * 15);
                    saturation = 100;
                } else {
                    lightness = 50;
                    saturation = 90;
                }
                items.push({ x, y, color: hslToHex(hue, saturation, lightness) });
            }
        }
        return items;
    }, []);

    return (
        <div className="flex justify-center items-center rounded-xl overflow-hidden will-change-transform">
            <svg
                viewBox={`${-svgWidth / 2} ${-svgHeight / 2} ${svgWidth} ${svgHeight}`}
                width="100%"
                height="auto"
                className="drop-shadow-sm"
                style={{ overflow: 'visible', maxHeight: '300px' }}
                shapeRendering="geometricPrecision"
            >
                {hexagons.map((hex, i) => {
                    const isActive = selectedColor.toLowerCase() === hex.color.toLowerCase();
                    return (
                        <path
                            key={i}
                            d={`M ${hex.x} ${hex.y - hexRadius} 
                    L ${hex.x + hexWidth/2} ${hex.y - hexRadius/2} 
                    L ${hex.x + hexWidth/2} ${hex.y + hexRadius/2} 
                    L ${hex.x} ${hex.y + hexRadius} 
                    L ${hex.x - hexWidth/2} ${hex.y + hexRadius/2} 
                    L ${hex.x - hexWidth/2} ${hex.y - hexRadius/2} Z`}
                            fill={hex.color}
                            onClick={() => onSelect(hex.color)}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            style={{
                                stroke: isActive ? 'white' : 'rgba(0,0,0,0.05)',
                                strokeWidth: isActive ? 2 : 0.5,
                                paintOrder: 'stroke',
                                zIndex: isActive ? 10 : 0
                            }}
                        />
                    );
                })}
            </svg>
        </div>
    );
});

function hslToHex(h: number, s: number, l: number) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}