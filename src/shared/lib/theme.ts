const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

export const isLightColor = (hex: string): boolean => {
    const rgb = hexToRgb(hex);
    if (!rgb) return false;
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 155;
};

export const applyTheme = (color: string) => {
    const root = document.documentElement;
    const isLight = isLightColor(color);
    root.style.setProperty('--theme-base', color);
    root.style.setProperty('--theme-contrast-text', isLight ? '#0f172a' : '#ffffff');
};