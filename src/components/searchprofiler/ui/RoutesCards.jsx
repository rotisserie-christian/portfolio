import { useMemo } from 'react';
import { getClusterColors } from '../utils/colors';

export default function RoutesCards() {
    const colorMap = useMemo(() => getClusterColors(), []);

    const cards = [
        {
            title: "Drum Pad",
            cluster: "Genre-Specific Tools",
            description: "Opens to the Studio tab with the drum machine active",
            url: "https://crayonbrain.com/create?t=drum-pad",
            label: "crayonbrain.com/create?t=drum-pad"
        },
        {
            title: "Visualizer",
            cluster: "Visualization",
            description: "Opens to the Live tab with the visualizer active",
            url: "https://crayonbrain.com/create?t=visualizer",
            label: "crayonbrain.com/create?t=visualizer"
        },
        {
            title: "House",
            cluster: "Genre-Specific Tools",
            description: "Opens to the Studio tab with a four to the floor pattern active",
            url: "https://crayonbrain.com/create?t=house",
            label: "crayonbrain.com/create?t=house"
        }
    ];

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-2">
            {cards.map((card, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center rounded-lg bg-base-200 p-4 border-base-300 w-full max-w-[360px]">
                    <h1 className="ubuntu-bold text-2xl text-neutral-content/85 mt-6 flex items-center">
                        <div
                            className="w-2.5 h-2.5 rounded-full mr-3 shrink-0"
                            style={{ backgroundColor: colorMap[card.cluster]?.indicator || '#888' }}
                            title={card.cluster}
                        />
                        {card.title}
                    </h1>

                    <p className="ubuntu-medium text-base text-center text-neutral-content/85 w-64 mt-4">
                        {card.description}
                    </p>

                    <p className="ubuntu-medium text-base underline text-cyan-200/90 cursor-pointer mt-8 mb-4">
                        <a href={card.url} target="_blank" rel="noreferrer">
                            {card.label}
                        </a>
                    </p>
                </div>
            ))}
        </div>
    );
}
