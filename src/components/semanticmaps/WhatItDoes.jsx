import Accordion from "../ui/Accordion";

export default function WhatItDoes() {
    return (
        <section className="flex flex-col items-center justify-center w-full mt-10 lg:mt-5">
            <div className="flex justify-center w-full">
                <div className="border-l-[10px] border-dotted border-white/20 h-[120px]"></div>
            </div>

            <p className="ubuntu-bold text-3xl lg:text-5xl text-neutral-content/85 mt-6 flex items-center">
                What it&apos;s for
            </p>

            <p className="mb-16 text-lg lg:text-xl mt-4 text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                The point is to connect the dots between what the user is trying to find and the feature they want
                on the website.
            </p>

            <div className="flex flex-col items-center justify-center lg:max-w-2xl w-full">
                <Accordion title="Market Segmentation" bgClassName="bg-base-200">
                    <p className="text-base mt-4 mb-8 ubuntu-regular text-neutral-content/75 text-left px-4">
                        A product will often be used for many different reasons, even if
                        the core offering is the same. By identifying which use cases have the highest interest, onboarding can
                        be optimized for how different people want to use the product.<br /><br />

                        For example, if someone wants to play around on a drum pad, it doesn&apos;t really make sense to have them
                        land on a different page and make them look for it. Most people will just give up. This is especially relevant
                        for a site like Crayonbrain, where many pages can be dense with information.<br /><br />
                    </p>
                </Accordion>
            </div>
        </section>
    );
}
