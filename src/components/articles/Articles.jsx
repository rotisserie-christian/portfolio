import { ExpandableRow, ProjectLink, paragraphClass } from "@/components/ui/ExpandableRow";

export default function Articles() {
    return (
        <section className="flex items-center justify-center w-full">
            <div className="flex flex-col mb-10 lg:mb-16 items-stretch w-full max-w-5xl px-4">
                <h2 className="scroll-mt-28 text-2xl lg:text-3xl ubuntu-bold text-neutral-content/85 text-left">
                    Articles
                </h2>

                <div className="relative mt-8">
                    <div
                        className="absolute left-0 top-[-20px] bottom-2 w-px bg-neutral-content/10"
                        aria-hidden="true"
                    />
                    <div className="flex flex-col items-stretch gap-4 pl-6">
                        <ExpandableRow title="Bulk Trends Analysis">
                            <p className={paragraphClass}>
                                A good way to uncover trending niches is to test sets of keywords 
                                against more general terms that are relevant to the product.   
                            </p>
                            <p className={paragraphClass}>
                                This helps build a mental model of how search interest is distributed across a given product, 
                                making the user segments better defined. 
                            </p>
                            <ProjectLink href="/trends" label="Read more" />
                            <p className={paragraphClass}>
                                Google Trends can show where interest concentrates, but only when many keywords sit on one comparable scale.
                                With a five-term batch limit, a large set is hard to rank accurately.
                            </p>
                            <p className={paragraphClass}>
                                This project takes a testable term set and compares keywords in batches against a stable anchor,
                                so relative interest can be read on a shared scale.
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
