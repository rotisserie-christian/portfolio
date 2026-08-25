import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Projects from "@/components/projects/Projects";
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
                <title>Christian Waters | Web Developer Saskatoon & Saskatchewan</title>
                <meta name="description" content="Custom software development in Saskatoon. Full-stack expertise in React, Python, and SEO-driven applications. Delivering high-performance web solutions for the local market." />
                <link rel="canonical" href="https://christianwaters.dev/" />
            </Helmet>

            <div className="flex flex-1 flex-col items-center w-full">
                <div data-section="crayonbrain" className="w-full">
                    <ErrorBoundary name="Projects">
                        <Projects />
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
