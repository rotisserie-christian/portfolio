import { ExpandableRow, ProjectLink, paragraphClass } from "@/components/ui/ExpandableRow";
import MusicComposerDemo from "./MusicComposerDemo";

export default function Projects() {
    return (
        <section className="flex items-center justify-center w-full">
            <div className="flex flex-col mb-10 lg:mb-16 items-stretch w-full max-w-5xl px-4">
                <h2 className="scroll-mt-28 text-2xl lg:text-3xl ubuntu-bold text-neutral-content/85 text-left">
                    Projects
                </h2>

                <div className="relative mt-8">
                    <div
                        className="absolute left-0 top-[-20px] bottom-2 w-px bg-neutral-content/10"
                        aria-hidden="true"
                    />
                    <div className="flex flex-col items-stretch gap-4 pl-6">
                        <ExpandableRow title="Music Composer">
                            <p className={paragraphClass}>
                                My biggest project is a website for creating reactive visuals from music.
                            </p>
                            <p className={paragraphClass}>
                                Providing music ready to use is a great way to engage users, but the bandwidth adds up fast.
                            </p>
                            <p className={paragraphClass}>
                                To get the most variety for the least data, I built a composer on-site.
                                That way we only need to transfer the sequence, and the client reconstructs the song using samples and synthesized sounds.
                            </p>
                            <MusicComposerDemo />
                            <p className={paragraphClass}>
                                Music is written using two separate step sequencer components, one for drums and the other for instruments.
                            </p>
                            <p className={paragraphClass}>
                                Each composer reads and modifies data in a ToneJS sequence. Sequence data is stored in refs. Using state would rerender the
                                component and recreate the sequence instance on every step, which causes stale closures and noticeable latency at higher BPMs.
                                During playback, the callback reads the current sequence from the ref and decides whether to trigger a sound.
                            </p>
                            <p className={paragraphClass}>
                                The currently playing step in both sequencers is highlighted during playback. Doing that with state would rerender on every step.
                                Instead, the current step is stored as a ref and updated by Tone. The same callback that triggers audio also updates the DOM,
                                moving the highlighting from the previous step to the current one. That keeps the UI in sync with audio and only rerenders when
                                the sequence changes or playback stops.
                            </p>
                        </ExpandableRow>

                        {/*}
                        <ExpandableRow title="Video Export Pipeline">
                            <p className={paragraphClass}>
                                To make reactive visuals from music, we can take FFT data from an audio source and wire parts of it to a web canvas.
                            </p>
                            <p className={paragraphClass}>
                                This works fine on the client for live feedback, but there are too many inconsistencies across browsers and devices to
                                encode a video this way.
                            </p>
                            <p className={paragraphClass}>
                                Instead, I built a VPS that does the same thing in a stable environment.
                            </p>
                            <ProjectLink href="https://crayonbrain.com" label="Visit site" />
                            <p className={paragraphClass}>
                                There are a lot of visuals on the site to choose from. The simpler ones run on the CPU, drawing to the
                                canvas every frame. More intricate ones use WebGL through Butterchurn, a web port of the
                                MilkDrop visualizer from Winamp.
                            </p>
                            <p className={paragraphClass}>
                                To make a video, the track is decoded up front, then each frame is drawn at a fixed timestamp, encoded to H.264, and muxed
                                with AAC into an MP4. That keeps A/V in lockstep even when the machine cannot draw the frame rate live. The VPS runs
                                that same Chrome encode path headlessly.
                            </p>
                            <p className={paragraphClass}>
                                To keep costs from running out of control, the job only starts if the user has enough tokens available.
                                The free tier provides a set number of tokens, and a weekly cron tops them up if any are used.
                            </p>
                        </ExpandableRow>
                        */}
                        <ExpandableRow title="Terminal CRM">
                            <p className={paragraphClass}>
                                A lot of GTM-type work involves using scripts to score leads and produce signals. 
                            </p>
                            <p className={paragraphClass}>
                                I built a terminal UI for tracking interactions with these leads, and running local LLM
                                sessions that reference the context behind them. 
                            </p>
                            <p className={paragraphClass}>
                                It's meant to be a lightweight and private tool for prototyping outbound strategies.
                            </p>
                            <ProjectLink href="https://github.com/rotisserie-christian/terminal-crm" label="View repo" />
                            <p className={paragraphClass}>
                                Leads import from JSON into SQLite, keyed by phone number so a second pass updates the same row instead of duplicating it. 
                                There's a filtered queue that displays each row and prompts for an outcome, removing the entry or leaving it, depending on which 
                                outcome was selected. 
                            </p>
                            <p className={paragraphClass}>
                                The LLM feature lets you select a model from HuggingFace, download the weights to your machine, and run it locally.
                                Up to 50% of the context window is reserved for relevant custom materials kept in a memory directory. 
                            </p>
                            <p className={paragraphClass}>
                                Relevancy is determined by comparing cosine similarity between the latest user message and the materials. 
                                If it fails to meet the threshold, the budget is instead spent on chat history, pruned by oldest messages first.
                            </p>
                        </ExpandableRow>
                    </div>
                </div>
            </div>
        </section>
    );
}
