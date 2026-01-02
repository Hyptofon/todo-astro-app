import React, { useState, useEffect } from 'react';
import { Palette, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { applyTheme } from '@/shared/lib/theme';
import { HexagonPicker } from './HexagonPicker';
import { useDebounce } from '@/shared/lib/hooks';

export const ThemePalette = () => {
    const [localColor, setLocalColor] = useState('#2563eb');
    const debouncedColor = useDebounce(localColor, 150);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        applyTheme(debouncedColor);
    }, [debouncedColor]);

    const handleHexSelect = (color: string) => {
        setLocalColor(color);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalColor(e.target.value);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    className="relative group p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-sm border border-transparent hover:border-current bg-white/80 backdrop-blur-sm"
                    style={{ color: 'var(--theme-primary)' }}
                    aria-label="Змінити тему"
                >
                    <Palette size={24} className="group-hover:rotate-12 transition-transform" />
                    <span
                        className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: localColor }}
                    />
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[280px] p-0 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 fade-in-0 duration-200"
                align="end"
                sideOffset={8}
            >
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <span className="text-sm font-semibold text-gray-700">Тема</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200/50 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="p-4 flex flex-col gap-4">

                    {/* Hexagon Grid */}
                    <div className="flex justify-center">
                        <HexagonPicker
                            selectedColor={debouncedColor}
                            onSelect={handleHexSelect}
                        />
                    </div>

                    <div className="h-px w-full bg-gray-100" />

                    {/* Precise Picker - Compact Version */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 overflow-hidden">
                            <div
                                className="w-8 h-8 rounded-lg border border-gray-200 shadow-sm transition-colors duration-75 shrink-0"
                                style={{ backgroundColor: localColor }}
                            />
                            <span className="font-mono font-bold text-gray-600 text-sm truncate">
                                {localColor}
                            </span>
                        </div>

                        <label className="relative cursor-pointer group active:scale-95 transition-transform">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-xs font-bold text-gray-700 uppercase tracking-wide">
                                <Palette size={14} />
                                <span>Свій</span>
                            </div>
                            <input
                                type="color"
                                value={localColor}
                                onChange={handleInputChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </label>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};