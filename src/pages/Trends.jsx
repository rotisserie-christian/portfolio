export default function Trends() {
    return (
        <section className="flex flex-col items-center justify-center w-full bg-base-300 py-20 px-2 min-h-screen font-ubuntu">
            <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-2">
                <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold text-center">
                    Refining Product-Market Fit Through Bulk Trends Analysis
                </h1>

                <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                    Optimizing product development based on search interest trends.
                </p>

                <div className="flex justify-center w-full mt-8 lg:mt-10">
                    <div className="border-l-[10px] border-dotted border-white/20 h-[120px]"></div>
                </div>

                <article className="flex flex-col w-full lg:max-w-3xl mt-8 lg:mt-10">
                    <h2 className="text-2xl lg:text-3xl ubuntu-bold text-neutral-content/85">
                        Assembling a Testable Term Set
                    </h2>

                    <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left">
                        Keyword analysis is only as useful as the set of terms behind it. The goal at this stage is not to prove demand, 
                        it is to build a list that honestly reflects what topics a target user might be interested in. It should be
                        wide enough to discover unexpected pull, and structured enough to compare later under a shared scale.
                    </p>

                    <h3 className="text-xl lg:text-2xl ubuntu-semibold text-neutral-content/85 mt-8">
                        Persona-Driven Search Intent
                    </h3>

                    <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left">
                        Start from a concrete user, not from a feature list. The goal is to start with 
                        who the ideal user is and what they want, and end with a better understanding of what to build.<br /><br />     
                        
                        From that framing, segment the user profile into a series of streams with clearly defined intent. 
                        The next step is to assemble a set of terms within each stream that capture more specific aspects 
                        of the user&apos;s search behaviour. This can be done by first manually brainstorming seed queries,
                        and then expanding the set to be more comprehensive. 
                    </p>

                    <h3 className="text-xl lg:text-2xl ubuntu-semibold text-neutral-content/85 mt-8">
                        Clusters and Curation
                    </h3>

                    <p className="text-base mt-4 ubuntu-regular text-neutral-content/75 text-left">
                        Expand each seed by pulling related queries from Google Trends. These need to be looked over dilligently, 
                        as Google Trends will frequently return highly general, often branded keywords. For example, a related term for 
                        "drum machine" might be "Spotify". There is an enormous difference in search behavior between these two;
                        one is focused on short-form, low-stakes music creation, and the other is focused on long-form media consumption
                        from a specific platform.<br /><br />

                        Another way to expand the set is to use an LLM. Related queries surface what people already search alongside the seeds, 
                        language models help fill gaps in wording that Google Trends alone will not invent. This is both a strength and a weakness;
                        it can create highly valuable alternate phrasings which are easy to miss, but it can also produce duplicate keywords,
                        or terms that are nonsensical.<br /><br />
                        
                        After this we can merge near-duplicates and drop noise. This curation step is important to avoid wasting API tokens on 
                        low quality or irrelevant terms. Once we have a clean set of terms, we can group them into semantic clusters, 
                        so later rankings read as themes, rather than a flat list of keywords.
                    </p>
                </article>
            </div>
        </section>
    );
}
