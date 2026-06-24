import { useState } from "react";

export function useSemanticMap() {
    const [viewMode, setViewMode] = useState('visuals'); // visuals/music

    const handleModeToggle = (checked) => {
        setViewMode(checked ? 'music' : 'visuals');
    };

    return {
        viewMode,
        handleModeToggle
    };
}
