import { Suspense, lazy } from "react";
const Earth = lazy(() => import('./Earth'));
import { FaAngleDoubleRight, FaReact } from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";
import { StarsBackground } from "../StarsBackground";

export default function Fakeairlines() {

    return (
        <section className="flex items-center justify-center w-full bg-base-300 min-h-screen relative">
            <StarsBackground />
            <div className="flex flex-col my-8 md:my-20 lg:my-32 items-center justify-center w-full relative z-10">
                <div className="flex flex-col items-center justify-center bg-opacity-90 backdrop-blur-sm px-4">
                    <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold">
                        Fake Airlines
                    </h1>

                    <div className="flex flex-row items-center justify-center w-full gap-2">
                        <div className="flex flex-row items-center justify-center w-24 h-8 bg-base-100 rounded-lg gap-2 mt-4">
                            <FaReact className="text-xl" />
                            <p className="text-xs">React</p>
                        </div>

                        <div className="flex flex-row items-center justify-center w-24 h-8 bg-base-100 rounded-lg gap-2 mt-4">
                            <RiTailwindCssFill className="text-xl" />
                            <p className="text-xs">Tailwind</p>
                        </div>
                    </div>

                    <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                        Business simulation game
                    </p>

                    <a 
                    href='https://fakeairlines.com' 
                    target='_blank' rel='noreferrer'>
                        <button className="btn w-26 bg-neutral text-cyan-200 rounded-xl mt-4 mb-8">
                            Visit<FaAngleDoubleRight />
                        </button>
                    </a>
                </div>

                <div className="w-full max-w-6xl h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden pointer-events-none">
                    <Suspense fallback={<div className="flex items-center justify-center h-full"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
                        <Earth />
                    </Suspense>
                </div>
            </div>
        </section>
    );
}
