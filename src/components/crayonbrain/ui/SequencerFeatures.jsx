import { FaCheck } from "react-icons/fa";

const SequencerFeatures = () => {
    const featureList = [
        "Drum pad, piano roll, and 3 oscillator synthesizer",
        "Reactive visuals from composer, mic, or uploaded audio",
        "Public feed for sharing and remixing tracks",
        "Export tracks to WAV or MIDI (Copyright Free)"
    ];

    return (
        <div className="flex flex-col h-full w-full items-center justify-center">
            <h2 className="text-2xl lg:text-3xl ubuntu-bold text-neutral-content/85 mb-8">
                Features
            </h2>

            <div className="flex flex-col gap-5">
                {featureList.map((feature, i) => (
                    <div key={i} className="flex flex-row items-start gap-4">

                        <FaCheck className="text-cyan-200 mt-1 shrink-0" />

                        <p className="ubuntu-medium text-lg text-left text-neutral-content/85">
                            {feature}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SequencerFeatures;
