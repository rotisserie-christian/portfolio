import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiMenuAlt1 } from "react-icons/hi";

export default function Navbar() {
    const scrollToSection = (sectionId) => {
        document.querySelector(`[data-section="${sectionId}"]`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        // Click to close dropdown by removing focus
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-base-300/70 backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-between w-full">
                <div className="flex flex-row items-center justify-between w-full max-w-7xl mx-auto py-2 px-4">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" aria-label="Open navigation menu">
                            <HiMenuAlt1 className="text-xl text-neutral-content/90" />
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow mt-4">
                            <li>
                                <a onClick={() => scrollToSection('crayonbrain')} className="text-neutral-content/90 hover:text-white">
                                    Crayonbrain
                                </a>
                            </li>
                            <li>
                                <a onClick={() => scrollToSection('searchprofiler')} className="text-neutral-content/90 hover:text-white">
                                    Search Profiler
                                </a>
                            </li>
                        </ul>
                    </div>

                    <ul className="flex flex-row items-center gap-2">
                        <li>
                            <a href='https://github.com/rotisserie-christian' target='_blank' rel='noreferrer' aria-label="GitHub Profile">
                                <button className="btn btn-neutral btn-circle" aria-label="GitHub">
                                    <FaGithub className="text-xl" />
                                </button>
                            </a>
                        </li>

                        <li>
                            <a href='https://linkedin.com/in/cwaters123' target='_blank' rel='noreferrer' aria-label="LinkedIn Profile">
                                <button className="btn btn-neutral btn-circle" aria-label="LinkedIn">
                                    <FaLinkedin className="text-xl" />
                                </button>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}