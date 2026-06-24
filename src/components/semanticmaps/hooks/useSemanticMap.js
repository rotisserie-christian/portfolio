import { useState, useMemo } from "react";
import joyplotVisuals from "../data/joyplotdata1.json";
import joyplotMusic from "../data/joyplotdata2.json";
import { getClusterColors } from '../utils/colors';

export function useSemanticMap() {
    const [viewMode, setViewMode] = useState('visuals'); // visuals/music

    const raw = useMemo(() => {
        return viewMode === 'visuals' ? joyplotVisuals : joyplotMusic;
    }, [viewMode]);

    const colorMap = useMemo(() => {
        const queries = raw.series.map((s) => s.query);
        return getClusterColors(queries);
    }, [raw]);

    const handleModeToggle = (checked) => {
        setViewMode(checked ? 'music' : 'visuals');
    };

    return {
        viewMode,
        raw,
        colorMap,
        handleModeToggle
    };
}
