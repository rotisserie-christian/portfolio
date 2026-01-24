import { FaAngleRight, FaAngleUp } from "react-icons/fa";
import { useState } from "react";

const HowItWorks = () => {
    const [isSequencingOpen, setIsSequencingOpen] = useState(false);
    const [isSyncOpen, setIsSyncOpen] = useState(false);
    const [isVizOpen, setIsVizOpen] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center lg:max-w-2xl w-full mb-20">
            <div className="flex justify-center w-full mt-8 lg:mt-10">
                <div className="border-l-[10px] border-dotted border-white/20 h-[120px]"></div>
            </div>

            <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold mt-8 lg:mt-10 mb-10">
                How it works
            </h1>

            <div 
                role="button"
                className="flex flex-col items-center justify-center bg-base-300 rounded-xl shadow-sm py-4 mb-2 w-full cursor-pointer"
                onClick={() => setIsSequencingOpen(!isSequencingOpen)}
            >
                <div className="flex flex-row items-center px-4 justify-between w-full">
                    <h2 className="text-xl lg:text-2xl ubuntu-semibold text-neutral-content/75">
                        Audio Sequencing
                    </h2>

                    {!isSequencingOpen ? (
                        <FaAngleRight className="text-neutral-content/75 text-3xl"/>
                        ) : (
                        <FaAngleUp className="text-neutral-content/75 text-3xl"/>
                    )}
                </div>
            </div>

            {isSequencingOpen && (
                <p className="text-base mt-4 mb-8 ubuntu-regular text-neutral-content/75 text-left px-4">
                    Music is written using 2 seperate step sequencer components, one for drums and the other for instruments.
                    Both are fixed to 8 steps per bar to ensure consistent UX across devices.<br /><br />

                    Each composer reads and modifies the data in a ToneJS sequence. 
                    Each active instrument has an array of objects containing values for active notes, while the drums are simple boolean arrays.
                    The drums could have been instrument objects as well, the separation is a UX decision to help mentally separate percussion 
                    from melodies while writing.<br /><br />

                    Sequence data is stored using refs because if state were used, 
                    the component would rerender and the sequence instance would be recreated.   
                    This would cause frequent stale closures, and enough latency to notice, especially at higher BPMs. <br /><br />

                    During playback, the callback reads the current sequence from the ref, 
                    and determines if an audio sample should be triggered at the current step.
                </p>
            )}

            <div 
                role="button"
                className="flex flex-col items-center justify-center bg-base-300 rounded-xl shadow-sm py-4 mb-2 w-full cursor-pointer"
                onClick={() => setIsSyncOpen(!isSyncOpen)}
            >
                <div className="flex flex-row items-center px-4 justify-between w-full">
                    <h2 className="text-xl lg:text-2xl ubuntu-bold text-neutral-content/75">
                        UI Synchronization
                    </h2>

                    {!isSyncOpen ? (
                        <FaAngleRight className="text-neutral-content/75 text-3xl"/>
                        ) : (
                        <FaAngleUp className="text-neutral-content/75 text-3xl"/>
                    )}
                </div>
            </div>

            {isSyncOpen && (
                <p className="text-base mt-4 mb-8 ubuntu-regular text-neutral-content/75 text-left px-4">
                    The currently playing step in both sequencers is highlighted during playback.<br /><br />

                    Doing this with state updates would trigger a rerender on every step. React can actually handle this well enough to work for 
                    reasonable BPMs (&lt;175), but it's a bad practice. Instead, the current step is stored as a ref and updated by Tone.<br /><br />

                    The same callback that triggers audio on each step also manipulates the DOM, 
                    removing the CSS highlighting from the previous step and applying it to the current step.<br /><br />

                    This keeps the UI in sync with the audio, while only rerendering when the sequence is changed, or if playback is stopped. 
                </p>
            )}

            <div 
                role="button"
                className="flex flex-col items-center justify-center bg-base-300 rounded-xl shadow-sm py-4 mb-2 w-full cursor-pointer"
                onClick={() => setIsVizOpen(!isVizOpen)}
            >
                <div className="flex flex-row items-center px-4 justify-between w-full">
                    <h2 className="text-xl lg:text-2xl ubuntu-bold text-neutral-content/75">
                        Visualization
                    </h2>

                    {!isVizOpen ? (
                        <FaAngleRight className="text-neutral-content/75 text-3xl"/>
                        ) : (
                        <FaAngleUp className="text-neutral-content/75 text-3xl"/>
                    )}
                </div>
            </div>

            {isVizOpen && (
                <p className="text-base mt-4 mb-8 ubuntu-regular text-neutral-content/75 text-left px-4">
                    The visuals are made with
                    <a href="https://github.com/jberg/butterchurn" target="_blank" rel="noreferrer" className="underline ml-1">Butterchurn</a>,
                    a web port of the famous 
                    <a href="https://www.geisswerks.com/milkdrop/" target="_blank" rel="noreferrer" className="underline mx-1">MilkDrop</a>
                    visualizer featured in Winamp.<br /><br />

                    It recieves FFT data passed in from a Web Audio API analyzer node, which connects to either the ToneJS output or the user's microphone.  
                    The microphone input is used for the Live feature. In addition to composing music, 
                    the user can also pipe in the audio from their own enviroment and fullscreen the visuals.<br /><br />

                    This feature is sandboxed to the browser for privacy, the microphone input is not saved or recorded in any way.
                </p>
            )}
        </div>
    );
};

export default HowItWorks;