import Accordion from "../../ui/Accordion";

const HowItWorks = () => {
    return (
        <div className="flex flex-col items-center justify-center lg:max-w-2xl w-full mb-20">
            <div className="flex justify-center w-full mt-8 lg:mt-10">
                <div className="border-l-[10px] border-dotted border-white/20 h-[120px]"></div>
            </div>

            <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold mt-8 lg:mt-10 mb-10">
                How it works
            </h1>

            <Accordion title="Audio Sequencing" titleClassName="ubuntu-semibold">
                <p className="text-base mt-4 mb-8 ubuntu-regular text-neutral-content/75 text-left px-4">
                    Music is written using 2 seperate step sequencer components, one for drums and the other for instruments.
                    Both are fixed to 8/16 steps per bar (8 on this demo) to ensure consistent UX across devices.<br /><br />

                    Each composer reads and modifies the data in a ToneJS sequence.
                    Each active instrument has an array of objects containing values for active notes, while the drums are simple boolean arrays.<br /><br />

                    The drums could have been instrument objects as well, and the two sequencers consolidated. Splitting them is a UX decision to help mentaly separate percussion
                    from melodies while writing.<br /><br />

                    Sequence data is stored using refs. If state were used,
                    the component would rerender and the sequence instance would be recreated.
                    This would cause frequent stale closures, and enough latency to notice, especially at higher BPMs. <br /><br />

                    During playback, the callback reads the current sequence from the ref,
                    and determines if an audio sample should be triggered at the current step.
                </p>
            </Accordion>

            <Accordion title="UI Synchronization">
                <p className="text-base mt-4 mb-8 ubuntu-regular text-neutral-content/75 text-left px-4">
                    The currently playing step in both sequencers is highlighted during playback.<br /><br />

                    Doing this with state updates would trigger a rerender on every step. React can actually handle this well enough to work for
                    reasonable BPMs (&lt;175), but it's a bad practice. Instead, the current step is stored as a ref and updated by Tone.<br /><br />

                    The same callback that triggers audio on each step also manipulates the DOM,
                    removing the CSS highlighting from the previous step and applying it to the current step.<br /><br />

                    This keeps the UI in sync with the audio, while only rerendering when the sequence is changed, or if playback is stopped.
                </p>
            </Accordion>

            <Accordion title="Visualization">
                <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left px-4">
                    The visuals are all made using the same general pattern; take FFT data from an audio source, and wire different parts of it to something 
                    on a web canvas.<br /><br />

                    The simpler ones are made using the same DOM manipulation trick used in the UI. The more intricate ones are made using
                    <a href="https://github.com/jberg/butterchurn" target="_blank" rel="noreferrer" className="underline ml-1">Butterchurn</a>,
                    a web port of the famous
                    <a href="https://www.geisswerks.com/milkdrop/" target="_blank" rel="noreferrer" className="underline mx-1">MilkDrop</a>
                    visualizer featured in Winamp.<br /><br />
                </p>
            </Accordion>
        </div>
    );
};

export default HowItWorks;
