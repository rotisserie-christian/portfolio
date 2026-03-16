import { FaCheck } from "react-icons/fa";

const Features = () => {
    return (
        <section className="flex flex-col items-center justify-center w-full mt-12">
            <div className="flex justify-center w-full">
                <div className="border-l-[10px] border-dotted border-white/20 h-[120px]"></div>
            </div>

            <h1 className="mt-8 lg:mt-10 text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold">
                Features
            </h1>

            <div className="flex flex-col lg:flex-row gap-2 mt-16 lg:items-start items-center justify-center w-full">
                {/* Music Composer */}
                <div className="flex flex-col items-center justify-start rounded-lg bg-base-300 px-6 py-12 border-base-300 h-[260px] w-full max-w-[360px]">
                    <h1 className="ubuntu-bold text-2xl text-neutral-content/85 flex items-center">
                        Music Composer
                    </h1>

                    <div className="flex flex-col mt-8 gap-4 w-full max-w-[280px]">
                        <div className="flex flex-row items-start justify-start gap-3">
                            <FaCheck className="text-neutral-content/85 shrink-0 mt-1" />
                            <p className="ubuntu-medium text-sm lg:text-base text-left text-neutral-content/85 leading-relaxed">
                                Drum pad, piano roll, and 3 oscillator synthesizer
                            </p>
                        </div>

                        <div className="flex flex-row items-start justify-start gap-3">
                            <FaCheck className="text-neutral-content/85 shrink-0 mt-1" />
                            <p className="ubuntu-medium text-sm lg:text-base text-left text-neutral-content/85 leading-relaxed">
                                Export to WAV or MIDI
                            </p>
                        </div>
                    </div>
                </div>

                {/* Visualizer */}
                <div className="flex flex-col items-center justify-start rounded-lg bg-base-300 px-6 py-12 border-base-300 h-[260px] w-full max-w-[360px]">
                    <h1 className="ubuntu-bold text-2xl text-neutral-content/85 flex items-center">
                        Visualizer
                    </h1>

                    <div className="flex flex-col mt-8 gap-4 w-full max-w-[280px]">
                        <div className="flex flex-row items-start justify-start gap-3">
                            <FaCheck className="text-neutral-content/85 shrink-0 mt-1" />
                            <p className="ubuntu-medium text-sm lg:text-base text-left text-neutral-content/85 leading-relaxed">
                                Reactive visuals from the composer, microphone input, or uploaded audio
                            </p>
                        </div>
                    </div>
                </div>

                {/* Share */}
                <div className="flex flex-col items-center justify-start rounded-lg bg-base-300 px-6 py-12 border-base-300 h-[260px] w-full max-w-[360px]">
                    <h1 className="ubuntu-bold text-2xl text-neutral-content/85 flex items-center">
                        Share
                    </h1>

                    <div className="flex flex-col mt-8 gap-4 w-full max-w-[280px]">
                        <div className="flex flex-row items-start justify-start gap-3">
                            <FaCheck className="text-neutral-content/85 shrink-0 mt-1" />
                            <p className="ubuntu-medium text-sm lg:text-base text-left text-neutral-content/85 leading-relaxed">
                                Post tracks to a public feed, remix tracks created by others
                            </p>
                        </div>

                        <div className="flex flex-row items-start justify-start gap-3">
                            <FaCheck className="text-neutral-content/85 shrink-0 mt-1" />
                            <p className="ubuntu-medium text-sm lg:text-base text-left text-neutral-content/85 leading-relaxed">
                                Export copyright free
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;