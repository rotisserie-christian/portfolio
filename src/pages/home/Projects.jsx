import { ExpandableRow, ProjectLink, paragraphClass } from "@/components/ui/ExpandableRow";
import StocksVisualizerDemo from "./StocksVisualizerDemo";
import MusicComposerDemo from "./MusicComposerDemo";
import HypnosisDemo from "./HypnosisDemo";

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
                        <ExpandableRow title="Music Visuals">
                            <HypnosisDemo />
                        </ExpandableRow>

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

                        <ExpandableRow title="Stocks Visualizer">
                            <p className={paragraphClass}>
                                A candlestick chart driven by music.
                            </p>
                            <StocksVisualizerDemo />
                            <p className={paragraphClass}>
                                Each candle is a biased random walk on the current price. Bull and bear options bias a direction and insert retracements that match. 
                                Chaos re-rolls every few bars so the trend flips randomly.
                            </p>
                            <p className={paragraphClass}>
                                BPM sets how fast candles form. FFT density determines how far apart the open and close prices are. 
                            </p>
                            <p className={paragraphClass}>
                                After a bar closes, a short lookback fits trendlines through recent highs and lows. 
                                Parallel or converging setups flash on the chart, then cool down so the same pattern does not retrigger.
                            </p>
                        </ExpandableRow>

                        <ExpandableRow title="Prerendering for Legacy SPAs">
                            <p className={paragraphClass}>
                                Older React SPAs often return an empty HTML shell and rely on JavaScript to render the page.
                                That can leave crawlers without the headings, copy, or links they need.
                            </p>
                            <p className={paragraphClass}>
                                Migrating the whole application to an SSR framework can be hard to justify when only a few
                                routes need to be crawlable, so I built a small post-build prerendering script instead.
                            </p>
                            <ProjectLink href="/prerendering" label="Read more" />
                            <p className={paragraphClass}>
                                After Vite builds the site, the script opens each configured route in headless Chromium,
                                waits for the page to render, and saves the resulting HTML to the matching path in
                                {" "}<code className="text-neutral-content/85">dist/</code>.
                                It is meant for a short list of important pages, not as a replacement for SSR or static site
                                generation.
                            </p>
                        </ExpandableRow>
                    </div>
                </div>
            </div>
        </section>
    );
}
