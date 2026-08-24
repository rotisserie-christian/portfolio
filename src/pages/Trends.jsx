import { useState, useLayoutEffect } from "react";
import LazyTrendChart from "@/components/semanticmaps/ui/LazyTrendChart";
import ScatterPlot from "@/components/semanticmaps/ui/ScatterPlot";
import TrendTable from "@/components/semanticmaps/ui/TrendTable";
import SectionNav from "@/components/ui/SectionNav";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/ui/Footer";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const MUSIC_VIDEO_MAKER = ["music video maker"];

const TRENDS_SECTIONS = [
    { id: "intro", label: "intro" },
    { id: "term-set", label: "term set" },
    { id: "bulk-comparison", label: "bulk comparison" },
    { id: "anchor-terms", label: "anchor terms" },
    { id: "reading-trend", label: "reading trends" },
    { id: "insights", label: "insights" },
];

export default function Trends() {
    const [viewMode, setViewMode] = useState("visuals");

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleModeToggle = (checked) => {
        setViewMode(checked ? "music" : "visuals");
    };

    return (
        <section className="flex flex-col items-center justify-center w-full bg-base-300 py-20 px-3 min-h-screen font-ubuntu">
            <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-2">
                <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold text-center">
                    Refining Features Through Bulk Trends Analysis
                </h1>

                <div className="flex justify-center w-full mt-8 lg:mt-10">
                    <div className="border-l-[10px] border-dotted border-white/20 h-[120px]"></div>
                </div>

                <SectionNav sections={TRENDS_SECTIONS} className="mt-4" />

                <article className="flex flex-col w-full max-w-4xl mt-8 lg:mt-10">
                    <h2
                        id="intro"
                        className="scroll-mt-28 text-2xl lg:text-3xl ubuntu-bold text-neutral-content/85"
                    >
                        Introduction
                    </h2>
                    <div className="divider mt-2 mb-0"></div>

                    <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left">
                        Google Trends can show where demand concentrates, but only when many keywords sit on one comparable
                        scale. With a five-term batch limit, a diverse set is hard to rank fairly. This article shows how to
                        work around that limit so search interest can steer product development toward in-demand features.
                    </p>

                    <h2
                        id="term-set"
                        className="scroll-mt-28 text-2xl lg:text-3xl ubuntu-bold text-neutral-content/85 mt-12"
                    >
                        Assembling a Testable Term Set
                    </h2>
                    <div className="divider mt-2 mb-0"></div>

                    <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left">
                        Keyword analysis is only as useful as the set of terms behind it. The goal at this stage is not to prove demand;
                        it is to build a list that honestly reflects what topics a target user might be interested in. It should be
                        wide enough to discover unexpected pull, and structured enough to compare later under a shared scale.
                    </p>

                    <h3 className="text-xl lg:text-2xl ubuntu-semibold text-neutral-content/85 mt-8">
                        Persona-Driven Search Intent
                    </h3>

                    <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left">
                        Start from a concrete user, not from a feature list. The goal is to start with 
                        who the ideal user is and what they want, and end with a better understanding of what to build.
                        From that framing, choose a head term that clearly defines a stream of search intent.
                    </p>

                    <div className="w-full my-8">
                        <ErrorBoundary name="Trends Chart">
                            <LazyTrendChart
                                viewMode="visuals"
                                showModeToggle={false}
                                queries={MUSIC_VIDEO_MAKER}
                            />
                        </ErrorBoundary>
                    </div>

                    <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left">
                        The next step is to assemble a set of terms within this stream that capture more specific aspects 
                        of the user&apos;s search behaviour. This can be done by first manually brainstorming seed queries,
                        and then expanding the set to be more comprehensive. 
                    </p>

                    <h3 className="text-xl lg:text-2xl ubuntu-semibold text-neutral-content/85 mt-8">
                        Clusters and Curation
                    </h3>

                    <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left">
                        Expand each seed by pulling related queries from Google Trends. These need to be looked over diligently, 
                        as Google Trends will frequently return highly general, often branded keywords. For example, a related term for 
                        "drum machine" might be "Spotify". There is an enormous difference in search behavior between these two;
                        one is focused on short-form, low-stakes music creation, and the other is focused on long-form media consumption
                        from a specific platform.<br /><br />

                        Another way to expand the set is to use an LLM. Related queries surface what people already search alongside the seeds;
                        language models help fill gaps in wording that Google Trends alone will not invent. This is both a strength and a weakness;
                        it can create highly valuable alternate phrasings which are easy to miss, but it can also produce duplicate keywords,
                        or terms that are nonsensical.<br /><br />
                        
                        After this we can merge near-duplicates and drop noise. This curation step is important to avoid wasting API tokens on 
                        low quality or irrelevant terms. Once we have a clean set of terms, we can group them into semantic clusters, 
                        so later rankings read as themes, rather than a flat list of keywords.<br /><br />

                        Each term is embedded with a sentence transformer, then grouped by cosine similarity so semantically close phrases 
                        land in the same cluster. That sorts near-duplicates automatically, and a quick human pass still fixes labels and intent mismatches.
                    </p>

                    <h2
                        id="bulk-comparison"
                        className="scroll-mt-28 text-2xl lg:text-3xl ubuntu-bold text-neutral-content/85 mt-12"
                    >
                        The Bulk Comparison Problem
                    </h2>
                    <div className="divider mt-2 mb-0"></div>

                    <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left">
                        Once the term set is large, the natural next step is to measure search interest across all of it.
                        Google Trends can do that, but only under certain constraints.
                    </p>

                    <h3 className="text-xl lg:text-2xl ubuntu-semibold text-neutral-content/85 mt-8">
                        Relative Interest Across Batches
                    </h3>

                    <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left">
                        Google Trends does not return absolute search volume. It returns a relative score from 0 to 100 within whatever set of 
                        terms you compare in a single request. The strongest term in that request is scaled to 100, everything else is expressed 
                        against it.<br /><br />

                        There is also a hard limit on how many terms can be compared at once: five per request. 
                        A useful keyword cluster is usually much larger than that, so the list has to be split into batches. 
                        Each batch gets its own 0-100 scale. That means a term scored 80 in one batch is not automatically comparable to a term scored 80 in another.
                    </p>

                    <h3 className="text-xl lg:text-2xl ubuntu-semibold text-neutral-content/85 mt-8">
                        Why Unanchored Ranking Misleads
                    </h3>

                    <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left">
                        Without a shared reference across batches, ranking the full list by those scores will mix incompatible scales. 
                        A niche term can look like a breakout hit because it was the loudest voice in a quiet batch. 
                        A genuinely high-volume term can look mediocre because it sat next to an even larger one. 
                        Sort that output and you get a leaderboard that reflects batch composition more than market demand.<br /><br />

                        That distortion matters for product decisions. If the goal is to refine what to build based on where interest 
                        concentrates, a false ranking is worse than no ranking: it can push attention toward noise and away from the streams 
                        that actually carry weight. Bulk comparison only becomes trustworthy once every batch is tied to the same baseline.
                    </p>

                    <h2
                        id="anchor-terms"
                        className="scroll-mt-28 text-2xl lg:text-3xl ubuntu-bold text-neutral-content/85 mt-12"
                    >
                        Anchor Terms
                    </h2>
                    <div className="divider mt-2 mb-0"></div>

                    <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left">
                        This bulk comparison problem is the reason why we started this process with higher-level segmentation. 
                        These main streams of search intent can act as anchors, a fixed reference included in every batch so each request 
                        can be scaled onto one shared baseline. 
                    </p>

                    <h3 className="text-xl lg:text-2xl ubuntu-semibold text-neutral-content/85 mt-8">
                        Choosing a Calibration Reference
                    </h3>

                    <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left">
                        A good anchor is stable, somewhat general, and strong enough to return a clear Trends signal in every batch. 
                        If the anchor is too obscure, some batches will have nothing reliable to scale against. 
                        If it is wildly larger than everything else in the set, terms can get crushed toward zero and lose useful resolution.<br /><br />
                    </p>

                    <h3 className="text-xl lg:text-2xl ubuntu-semibold text-neutral-content/85 mt-8">
                        Scaling Batches to a Shared Baseline
                    </h3>

                    <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left">
                        In practice, each Trends request carries up to four candidate terms plus the anchor. 
                        The first batch establishes a reference from the anchor&apos;s peak interest. 
                        Every later batch measures how the same anchor scored in that request, computes a multiplier against the reference, 
                        and rebases the other terms in the batch by that factor.<br /><br />

                        After rebasing, scores from different batches sit on roughly the same scale. 
                        A high-interest term and a low-interest term can finally be ranked against each other even if they never shared a request.
                    </p>

                    <h2
                        id="reading-trend"
                        className="scroll-mt-28 text-2xl lg:text-3xl ubuntu-bold text-neutral-content/85 mt-12"
                    >
                        Reading the Trends
                    </h2>
                    <div className="divider mt-2 mb-0"></div>

                    <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left">
                        The signal we are looking for is how strong interest is relative to the rest of the set.
                    </p>

                    <h3 className="text-xl lg:text-2xl ubuntu-semibold text-neutral-content/85 mt-8">
                        Ranking by Normalized Interest
                    </h3>

                    <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left">
                        After normalization, terms are ranked by average interest over the window. 
                        Terms with no usable signal drop out; what remains is an ordered view of where relative demand concentrates.
                    </p>

                    <div className="w-full my-8 flex flex-col lg:flex-row gap-6 lg:items-start">
                        <div className="w-full lg:w-1/2 min-w-0">
                            <ErrorBoundary name="Scatter Plot">
                                <ScatterPlot />
                            </ErrorBoundary>
                        </div>
                        <div className="w-full lg:w-1/2 min-w-0">
                            <TrendTable />
                        </div>
                    </div>

                    <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left">
                        That ranking is still relative, not absolute volume. It answers &ldquo;which of these topics pull harder than the others against 
                        the same baseline?&rdquo; not &ldquo;how many searches happen worldwide.&rdquo;
                    </p>

                    <h2
                        id="insights"
                        className="scroll-mt-28 text-2xl lg:text-3xl ubuntu-bold text-neutral-content/85 mt-12"
                    >
                        Key Insights 
                    </h2>
                    <div className="divider mt-2 mb-0"></div>

                    <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left">
                    We can see that the top keywords fit the anchor term 'music video maker' quite well, yet still carry their own unique intent.
                    A 'background video' can be used to create a music video, but it can also be used to make a video for other purposes.
                    Many people will want to create reactive music visuals for YouTube intros or advertising, but are less likely to phrase it as 
                    a desire to create a music video.<br /><br />

                    Similarly, 'spectrogram' is more likely to be used by more technical users such as music producers, DJs, or music tech developers. 
                    Many of these people publish on social media, have a need for audio-reactive visuals, and this need is adjacent to, yet distinct
                    from, the need to create a music video.  
                    </p>

                    <div className="w-full my-8">
                        <ErrorBoundary name="Trends Chart">
                            <LazyTrendChart
                                viewMode={viewMode}
                                onModeToggle={handleModeToggle}
                                showModeToggle={true}
                            />
                        </ErrorBoundary>
                    </div>

                    <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left">
                    These keywords capture search intent distinct from the anchor, and their relative interest actually exceeds it.
                    Because of this, they can be used as their own head terms.
                    This gives us validated market segments, and a clear signal for building features that meet their needs.
                    <br /><br />

                    That was a lot of reading. Maybe you should take a break and play around with a{" "}
                    <a
                        href="https://crayonbrain.com/compose?t=drum-pad"
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-cyan-200 hover:text-cyan-400 transition-colors"
                    >
                        drum pad
                    </a>
                    . Or maybe make a{" "}
                    <a
                        href="https://crayonbrain.com/visuals?t=spectrogram"
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-cyan-200 hover:text-cyan-400 transition-colors"
                    >
                        spectrogram
                    </a>
                    , if that&apos;s your thing.
                    </p>
                </article>

                <div className="flex justify-center w-full mt-12 lg:mt-16">
                    <div className="border-l-[10px] border-dotted border-white/20 h-[120px]"></div>
                </div>
            </div>

            <Contact source="trends" />
            <Footer />
        </section>
    );
}
