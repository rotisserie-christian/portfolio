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
                <div className="flex flex-col items-center justify-center rounded-lg bg-base-300 px-4 py-12 border-base-300 w-full max-w-[360px]">
                    <h1 className="ubuntu-bold text-2xl text-neutral-content/85 flex items-center">
                        Music Composer
                    </h1>

                    <div className="flex flex-col mt-6 items-center justify-center">
                        <div className="flex flex-row items-start justify-center w-72 gap-2">
                            <FaCheck className="text-neutral-content/85 shrink-0 mt-1" />
                            <p className="ubuntu-medium text-base text-left text-neutral-content/85">
                                Drum pad, piano roll, and 3 oscillator synthesizer
                            </p>
                        </div>

                        <div className="flex flex-row items-center justify-start mt-4 w-72 gap-2">
                            <FaCheck className="text-neutral-content/85" />
                            <p className="ubuntu-medium text-base text-left text-neutral-content/85">
                                Export to WAV or MIDI
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center rounded-lg bg-base-300 px-4 py-12 border-base-300 w-full max-w-[360px]">
                    <h1 className="ubuntu-bold text-2xl text-neutral-content/85 flex items-center">
                        Visualizer
                    </h1>

                    <div className="flex flex-col mt-6 items-center justify-center w-72">
                        <div className="flex flex-row items-start justify-center gap-2">
                            <FaCheck className="text-neutral-content/85 shrink-0 mt-1" />
                            <p className="ubuntu-medium text-base text-left text-neutral-content/85">
                                Reactive visuals from the composer, Spotify, or microphone input
                            </p>
                        </div>

                        <div className="flex flex-row items-center justify-start mt-4 w-72 gap-2">
                            <FaCheck className="text-neutral-content/85" />
                            <p className="ubuntu-medium text-base text-left text-neutral-content/85">
                                Supports fullscreen and VR
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center rounded-lg bg-base-300 px-4 py-12 border-base-300 w-full max-w-[360px]">
                    <h1 className="ubuntu-bold text-2xl text-neutral-content/85 flex items-center">
                        Share
                    </h1>

                    <div className="flex flex-row mt-6 items-start justify-center w-72 gap-2">
                        <FaCheck className="text-neutral-content/85 shrink-0 mt-1" />
                        <p className="ubuntu-medium text-base text-left text-neutral-content/85">
                            Post tracks to a public feed, remix tracks created by others
                        </p>
                    </div>

                    <div className="flex flex-row items-center justify-start mt-4 w-72 gap-2">
                        <FaCheck className="text-neutral-content/85" />
                        <p className="ubuntu-medium text-base text-left text-neutral-content/85">
                            Export copyright free
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;