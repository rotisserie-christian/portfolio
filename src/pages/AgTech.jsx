import Contact from "@/components/contact/Contact";
import Footer from "@/components/ui/Footer";
import SpoilageWidget from "@/components/agtech/SpoilageWidget";
import { FaSeedling } from "react-icons/fa";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function AgTech() {
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-base-300">
            <section className="w-full bg-base-200 py-32 px-6 flex flex-col items-center">
                <div className="max-w-4xl text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 ubuntu-bold text-neutral-content/85">
                        Custom Widgets
                    </h2>
                    <p className="text-lg text-base-content/70 ubuntu-medium max-w-2xl mx-auto">
                        Engage visitors and generate more leads with custom-made interactive tools
                    </p>
                </div>

                <ErrorBoundary name="AgTech Widget">
                    <SpoilageWidget />
                </ErrorBoundary>
            </section>

            <div className="w-full bg-base-200">
                <Contact
                    Icon={FaSeedling}
                    heading="Get Started"
                    tagline="Put something like this on your own domain"
                    source="agtech"
                />
            </div>

            <Footer />
        </div>
    );
}
