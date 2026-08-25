import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Projects from "@/components/projects/Projects";
import Articles from "@/components/articles/Articles";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/ui/Footer";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function Home() {
    const location = useLocation();

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
                <div data-section="crayonbrain" className="w-full">
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
                    <Contact />
                </div>

                <Footer />
            </div>
        </>
    );
}
