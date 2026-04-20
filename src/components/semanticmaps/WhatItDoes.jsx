import RoutesCards from "./ui/RoutesCards";

export default function WhatItDoes({ colorMap }) {
    return (
        <section className="flex flex-col items-center justify-center w-full mt-10 lg:mt-5">
            <div className="flex justify-center w-full">
                <div className="border-l-[10px] border-dotted border-white/20 h-[120px]"></div>
            </div>

            <p className="ubuntu-bold text-3xl lg:text-5xl text-neutral-content/85 mt-6 flex items-center">
                What it does
            </p>

            <p className="mb-16 text-lg lg:text-xl mt-4 text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                The point is to connect the dots between what the user is trying to find and the feature they want
                on the website
            </p>

            <RoutesCards colorMap={colorMap} />
        </section>
    );
}