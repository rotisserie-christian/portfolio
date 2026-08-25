import { useLayoutEffect } from "react";
import SectionNav from "@/components/ui/SectionNav";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/ui/Footer";

const PRERENDER_SECTIONS = [
    { id: "intro", label: "intro" },
    { id: "not-ssr", label: "not ssr" },
    { id: "pipeline", label: "pipeline" },
    { id: "wait", label: "wait strategy" },
    { id: "limits", label: "limits" },
];

const p = "text-base mt-4 ubuntu-regular text-neutral-content/75 text-left";
const h2 = "scroll-mt-28 text-2xl lg:text-3xl ubuntu-bold text-neutral-content/85";
const h3 = "text-xl lg:text-2xl ubuntu-semibold text-neutral-content/85 mt-8";

export default function Prerendering() {
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <section className="flex flex-1 flex-col items-center w-full bg-base-300 py-20 px-3 font-ubuntu">
            <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-2">
                <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold text-center">
                    Prerendering for Legacy SPAs
                </h1>

                <div className="flex justify-center w-full mt-8 lg:mt-10">
                    <div className="border-l-[10px] border-dotted border-white/20 h-[120px]"></div>
                </div>

                <SectionNav sections={PRERENDER_SECTIONS} className="mt-4" />

                <article className="flex flex-col w-full max-w-4xl mt-8 lg:mt-10">
                    <h2 id="intro" className={h2}>
                        Introduction
                    </h2>
                    <div className="divider mt-2 mb-0"></div>

                    <p className={p}>
                        A client-rendered React app returns an empty shell. Crawlers that do not run JavaScript will not see the
                        copy, headings, or links inside <code className="text-neutral-content/85">#root</code>.
                    </p>

                    <p className={p}>
                        Migrating to a server-rendered framework can fix this, but that can be hard to justify when only a few routes
                        need to be crawlable. For those cases, I use a post-build script that snapshots the important routes as HTML
                        and writes them alongside the rest of <code className="text-neutral-content/85">dist/</code>.
                    </p>

                    <h2 id="not-ssr" className={`${h2} mt-12`}>
                        Not Server Rendering
                    </h2>
                    <div className="divider mt-2 mb-0"></div>

                    <p className={p}>
                        This is not a replacement for server rendering. It is meant for an existing SPA with a short list of pages
                        that need readable HTML, where rebuilding the application around SSR would be unnecessary.
                    </p>

                    <p className={p}>
                        Nothing runs at request time. Puppeteer opens the built site during the build, either in CI or on a local
                        machine, then writes the rendered HTML into the output folder. The static host serves those files like any
                        other asset.
                    </p>

                    <p className={p}>
                        The SPA still behaves the same after it loads. The only change is that listed routes return useful HTML
                        before React takes over.
                    </p>

                    <h2 id="pipeline" className={`${h2} mt-12`}>
                        The Build Pipeline
                    </h2>
                    <div className="divider mt-2 mb-0"></div>

                    <p className={p}>
                        After Vite writes <code className="text-neutral-content/85">dist/</code>, the script starts a preview
                        server and opens each configured route in headless Chromium. It serializes the rendered page and saves it
                        to the matching output path. <code className="text-neutral-content/85">/</code> becomes
                        {" "}<code className="text-neutral-content/85">dist/index.html</code>, and nested paths become
                        {" "}<code className="text-neutral-content/85">dist/&lt;route&gt;/index.html</code>.
                    </p>

                    <p className={p}>
                        It is a single file that can be copied into a Vite project and run after
                        {" "}<code className="text-neutral-content/85">vite build</code>. The route list tells it which pages
                        to render.
                    </p>

                    <h2 id="wait" className={`${h2} mt-12`}>
                        Waiting for Real Content
                    </h2>
                    <div className="divider mt-2 mb-0"></div>

                    <p className={p}>
                        Waiting for <code className="text-neutral-content/85">domcontentloaded</code> is not enough for lazy routes
                        or code-split chunks. The browser can reach that event while the page is still showing a loading state.
                    </p>

                    <p className={p}>
                        The script waits for an <code className="text-neutral-content/85">h1</code> before saving each route.
                        That works for simple, text-heavy pages. If meta tags are being updated through something like
                        {" "}<code className="text-neutral-content/85">react-helmet-async</code>, the wait condition should
                        target those tags instead.
                    </p>

                    <h3 className={h3}>
                        Failures in CI
                    </h3>

                    <p className={p}>
                        If a route times out or never renders its heading, the script logs the failure and continues with the
                        remaining routes. It exits with code 1 after the run if anything failed, so CI catches incomplete output.
                    </p>

                    <h2 id="limits" className={`${h2} mt-12`}>
                        What This Does Not Fix
                    </h2>
                    <div className="divider mt-2 mb-0"></div>

                    <p className={p}>
                        This approach does not scale well to hundreds of routes. Every route has to load in a browser during the
                        build, the output grows with each snapshot, and the HTML becomes stale until the next deployment.
                    </p>

                    <p className={p}>
                        Prerendering also only changes the initial response. Client-side navigation still uses the original SPA,
                        and dynamic data is only as current as the last build. For a large content site, proper SSR or static site
                        generation is a better fit.
                    </p>

                    <p className={p}>
                        For a small legacy SPA, it is a practical way to make a few important routes crawlable without refactoring
                        the application.
                    </p>

                    <p className={p}>
                        The script lives in{" "}
                        <a
                            href="https://github.com/rotisserie-christian/simple-prerender"
                            target="_blank"
                            rel="noreferrer"
                            className="underline text-cyan-200 hover:text-cyan-400 transition-colors"
                        >
                            simple-prerender
                        </a>
                        .
                    </p>
                </article>

                <div className="flex justify-center w-full mt-12 lg:mt-16">
                    <div className="border-l-[10px] border-dotted border-white/20 h-[120px]"></div>
                </div>
            </div>

            <Contact source="prerendering" />
            <Footer />
        </section>
    );
}
