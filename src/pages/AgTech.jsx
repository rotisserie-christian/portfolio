import Contact from "../components/contact/Contact";
import Footer from "../components/ui/Footer";
import SpoilageWidget from "../components/agtech/SpoilageWidget";

export default function AgTech() {
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-base-300">
            <section className="w-full bg-base-200 py-32 px-6 flex flex-col items-center">
                <div className="max-w-4xl text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 ubuntu-bold text-neutral-content/85">Widgeto</h2>
                    <p className="text-lg text-base-content/70 ubuntu-medium max-w-2xl mx-auto">
                        Grain Storage Spoilage Calculator for Wordpress and Webflow.
                    </p>
                </div>

                <SpoilageWidget />
            </section>

            <div className="w-full bg-base-200">
                <Contact />
            </div>

            <Footer />
        </div>
    );
}
