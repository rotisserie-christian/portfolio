import { FaAngleDoubleRight } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { ShootingStars } from "../components/starfield/ShootingStars";
import { StarsBackground } from "../components/starfield/StarsBackground";
import Crayonbrain from "../components/crayonbrain/Crayonbrain";
import SearchProfiler from "../components/searchprofiler/SearchProfiler";
import Contact from "../components/contact/Contact";
import Footer from "../components/ui/Footer";

export default function Home() {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    const scrollToProjects = () => {
        document.querySelector('[data-section="crayonbrain"]')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    return (
        <>
            <Helmet>
                <title>Christian Waters | Web Developer Saskatoon & Saskatchewan</title>
                <meta name="description" content="Custom software development in Saskatoon. Full-stack expertise in React, Python, and SEO-driven applications. Delivering high-performance web solutions for the local market." />
                <link rel="canonical" href="https://christianwaters.dev/" />
            </Helmet>

            <div className="flex flex-col items-center justify-center w-full">
                <section className="flex items-center justify-center w-full min-h-screen bg-base-300 min-h-screen">
                    <StarsBackground />
                    <ShootingStars />

                    <div className="flex flex-col items-center justify-center bg-base-300/60 mb-20 lg:mb-0 z-40 lg:px-16 rounded-3xl">
                        <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold">
                            Christian Waters
                        </h1>

                        <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                            {!isChrome && <span className="text-xl mr-2">🇨🇦</span>}Web Developer
                        </p>

                        <button
                            onClick={scrollToProjects}
                            className="btn w-28 lg:w-32 lg:btn-lg btn-neutral text-cyan-200 rounded-xl lg:rounded-2xl mt-10"
                        >
                            Projects<FaAngleDoubleRight />
                        </button>
                    </div>
                </section>

                <div data-section="crayonbrain" className="w-full">
                    <Crayonbrain />
                </div>

                <div data-section="searchprofiler" className="w-full">
                    <SearchProfiler />
                </div>

                <div data-section="contact" className="w-full">
                    <Contact />
                </div>

                <Footer />
            </div>
        </>
    );
}