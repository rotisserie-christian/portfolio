import { FaAngleDoubleRight } from "react-icons/fa";
import { ShootingStars } from "../components/ShootingStars";
import { StarsBackground } from "../components/StarsBackground";
import Crayonbrain from "../components/crayonbrain/Crayonbrain";
import Flowchart from "../components/flowchart/Flowchart";

export default function Home() {
    const scrollToProjects = () => {
        document.querySelector('[data-section="crayonbrain"]')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    };

    return (
        <>
        <div className="flex flex-col items-center justify-center w-full">
            <section className="flex items-center justify-center w-full min-h-screen bg-base-300 min-h-screen">
                <StarsBackground />
                <ShootingStars />

                <div className="flex flex-col items-center justify-center bg-opacity-90 backdrop-blur-sm px-4">
                    <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold">
                        Christian Waters
                    </h1>

                    <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                        <span className="text-xl mr-2">{'\u{1F1E8}\u{1F1E6}'}</span>Web Developer 
                    </p>

                    <button 
                        onClick={scrollToProjects}
                        className="btn w-28 lg:w-32 lg:btn-lg bg-neutral text-cyan-200 rounded-xl lg:rounded-2xl mt-10"
                    >
                        Projects<FaAngleDoubleRight />
                    </button>
                </div>
            </section>

            <div data-section="crayonbrain">
                <Crayonbrain />
            </div>

            <div className="flex flex-col lg:flex-row mt-10 mb-20 gap-10 lg:gap-20 items-center justify-center max-w-5xl mx-auto w-full">
                <div className="flex flex-col items-center lg:items-end justify-center w-full px-2">
                    <h1 className="text-3xl lg:text-5xl lg:text-right text-neutral-content/85 ubuntu-bold mb-6 lg:mb-8">
                        How it works
                    </h1>

                    <p className="lg:text-lg lg:text-right text-neutral-content/85 text-left w-full max-w-sm lg:max-w-xl lg:text-left">
                        The main feature is converting music clips into abstract visuals that can be downloaded as a video file.<br /><br />
                        Audio can be uploaded or piped in from a microphone.<br /><br />
                        The visuals are made with Butterchurn, a web port of the famous MilkDrop visualizer featured in Winamp.<br /><br />
                        Crayonbrain is an attempt to extend this project by building audio systems around it, and making it easier to share the results.<br /><br />
                    </p>
                </div>

                <div className="w-full">
                    <Flowchart />
                </div>
            </div>
        </div>
        </>
    );
}