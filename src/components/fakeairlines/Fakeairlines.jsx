import { Suspense, lazy, useState, useRef, useEffect } from "react";
const Earth = lazy(() => import('./Earth'));
import { FaAngleDoubleRight, FaReact } from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";
import { StarsBackground } from "../StarsBackground";

export default function Fakeairlines() {
    const [shouldLoadEarth, setShouldLoadEarth] = useState(false);
    const earthSectionRef = useRef();

    // Intersection Observer for Earth
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !shouldLoadEarth) {
                    setShouldLoadEarth(true);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        const currentRef = earthSectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [shouldLoadEarth]);

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

                <div ref={earthSectionRef} className="w-full max-w-6xl h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden pointer-events-none">
                    {shouldLoadEarth ? (
                        <Suspense fallback={<div className="flex items-center justify-center h-full"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
                            <Earth />
                        </Suspense>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-base-200 rounded-xl">
                            <div className="flex flex-col items-center gap-4">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
