import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Projects from "./Projects";
import Articles from "./Articles";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/ui/Footer";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function Home() {
    const location = useLocation();
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    useEffect(() => {
        const section = location.state?.scrollTo;
        if (!section) return;

        const timer = setTimeout(() => {
            document.querySelector(`[data-section="${section}"]`)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }, 100);
        return () => clearTimeout(timer);
    }, [location.state]);

    return (
        <>
            <Helmet>
                <title>Christian Waters | Developer Portfolio</title>
                <meta name="description" content="Full stack creative tools developer in Saskatoon, Saskatchewan" />
                <link rel="canonical" href="https://christianwaters.dev/" />
            </Helmet>

            <div className="flex flex-1 flex-col items-center w-full">
                <header className="w-full max-w-5xl px-4 mt-5 mb-12 lg:mb-16">
                    <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold text-left mt-8">
                        Christian Waters
                    </h1>
                    <p className="text-lg lg:text-xl mt-3 text-neutral-content/85 text-left">
                        {!isChrome && <span className="text-xl mr-2">🇨🇦</span>}Web Developer
                    </p>
                </header>

                <div data-section="projects" className="w-full">
                    <ErrorBoundary name="Projects">
                        <Projects />
                    </ErrorBoundary>
                </div>

                <div data-section="articles" className="w-full">
                    <ErrorBoundary name="Articles">
                        <Articles />
                    </ErrorBoundary>
                </div>

                <div data-section="contact" className="w-full">
                    <ErrorBoundary name="Contact">
                        <Contact />
                    </ErrorBoundary>
                </div>

                <Footer />
            </div>
        </>
    );
}
