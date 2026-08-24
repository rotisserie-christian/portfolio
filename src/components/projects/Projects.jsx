import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaMinus, FaPlus } from "react-icons/fa";

const paragraphClass = "text-base mt-4 ubuntu-regular text-neutral-content/75 text-left";

function ProjectLink({ href, label }) {
    const className = "btn btn-outline border-cyan-200/25 border-2 mt-4 text-cyan-100";
    const content = (
        <>
            {label}
            <FaArrowRight />
        </>
    );

    if (href.startsWith("/")) {
        return (
            <Link to={href} className={className}>
                {content}
            </Link>
        );
    }

    return (
        <a href={href} target="_blank" rel="noreferrer" className={className}>
            {content}
        </a>
    );
}

function ProjectRow({ title, children }) {
    const [isOpen, setIsOpen] = useState(false);
    const buttonLabel = isOpen ? `Collapse ${title}` : `Expand ${title}`;

    return (
        <div className="w-full">
            <button
                type="button"
                className="flex flex-row items-center gap-3 lg:gap-4 w-full cursor-pointer"
                aria-expanded={isOpen}
                aria-label={buttonLabel}
                onClick={() => setIsOpen((open) => !open)}
            >
                <h3 className="text-xl lg:text-2xl text-neutral-content/85 ubuntu-semibold text-left min-w-0">
                    {title}
                </h3>
                <div className="flex-1 h-px bg-neutral-content/20 min-w-4" aria-hidden="true" />
                <span className="btn btn-square btn-outline border-neutral-content/10 border-2 shrink-0 pointer-events-none">
                    {isOpen ? <FaMinus className="text-neutral-content/85" /> : <FaPlus className="text-neutral-content/85" />}
                </span>
            </button>

            {isOpen && (
                <div className="mb-2">
                    {children}
                </div>
            )}
        </div>
    );
}

export default function Projects() {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    return (
        <section className="flex items-center justify-center w-full">
            <div className="flex flex-col mt-5 mb-10 lg:mb-16 items-stretch w-full max-w-4xl px-4">
                <header className="mb-12 lg:mb-16">
                    <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold text-left mt-8">
                        Christian Waters
                    </h1>
                    <p className="text-lg lg:text-xl mt-3 text-neutral-content/85 text-left">
                        {!isChrome && <span className="text-xl mr-2">🇨🇦</span>}Web Developer
                    </p>
                </header>

                <h2 className="scroll-mt-28 text-2xl lg:text-3xl ubuntu-bold text-neutral-content/85 text-left">
                    Projects
                </h2>

                <div className="relative mt-8">
                    <div
                        className="absolute left-0 top-[-20px] bottom-2 w-px bg-neutral-content/10"
                        aria-hidden="true"
                    />
                    <div className="flex flex-col items-stretch gap-6 pl-6">
                        <ProjectRow title="Music Composer">
                            <p className={paragraphClass}>
                                My biggest project is a website for creating reactive visuals from music.
                            </p>
                            <p className={paragraphClass}>
                                Providing music ready to use is a great way to engage users, but the bandwidth adds up fast.
                            </p>
                            <p className={paragraphClass}>
                                To get the most variety for the least data, I built a composer on-site. 
                                We only transfer the sequence, and the client reconstructs the song.
                            </p>
                            <ProjectLink href="https://crayonbrain.com" label="Visit site" />
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
                        </ProjectRow>

                        <ProjectRow title="Video Export Pipeline">
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
                        </ProjectRow>
{/*
                        <ProjectRow title="Bulk Trends Analysis">
                            <p className={paragraphClass}>
                                Placeholder
                            </p>
                            <ProjectLink href="/trends" label="Read more" />
                            <p className={paragraphClass}>
                                Google Trends can show where demand concentrates, but only when many keywords sit on one comparable scale.
                                With a five-term batch limit, a diverse set is hard to rank accurately.
                            </p>
                            <p className={paragraphClass}>
                                This project builds a testable term set from user intent, then compares keywords in batches against a stable anchor
                                so relative interest can be read on a shared scale. The result is a way to steer product features toward in-demand
                                topics instead of guessing from a handful of non-comparable queries.
                            </p>
                        </ProjectRow>

                        <ProjectRow title="Prerendering for Legacy SPAs">
                            <p className={paragraphClass}>
                                Placeholder
                            </p>
                            <ProjectLink href="https://github.com/rotisserie-christian/simple-prerender" label="View repo" />
                            <p className={paragraphClass}>
                                Placeholder
                            </p>
                        </ProjectRow>

                        <ProjectRow title="Terminal CRM">
                            <p className={paragraphClass}>
                                Placeholder
                            </p>
                            <ProjectLink href="https://github.com/rotisserie-christian/terminal-crm" label="View repo" />
                            <p className={paragraphClass}>
                                A local CRM for working a small list by hand, not blasting one. Leads import from JSON into SQLite, keyed by phone
                                so a second pass updates the same row instead of duplicating it. Dial is a filtered queue: step through, log an outcome,
                                and the list changes. Voicemail stays in place, a callback jumps the line, and anything closed or do-not-call drops off.
                            </p>
                            <p className={paragraphClass}>
                                There is an optional on-device LLM for drafting against notes you keep in markdown. Prompts are a system message,
                                optional RAG from those files, then chat history. The point is brainstorming on hardware you already have,
                                without sending the list anywhere.
                            </p>
                        </ProjectRow>
                        */}
                    </div>
                </div>
            </div>
        </section>
    );
}
