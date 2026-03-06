import BrowserMockup from "./ui/BrowserMockup";

export default function WhatItDoes() {
    return (
        <section className="flex flex-col items-center justify-center w-full">
            <div className="flex justify-center w-full mt-8 lg:mt-10">
                <div className="border-l-[10px] border-dotted border-white/20 h-[120px]"></div>
            </div>

            <h1 className="mt-8 lg:mt-10 text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold">
                What it does
            </h1>

            <p className="mb-16 text-lg lg:text-xl mt-4 text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                The point is to create dynamic routes containing content and metadata
                that matches the search intent
            </p>

            <BrowserMockup param="drum-pad" />
        </section>
    );
}