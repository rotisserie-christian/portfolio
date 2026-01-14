import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiMenuAlt1 } from "react-icons/hi";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full bg-base-300/70 backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-between w-full">
                <div className="flex flex-row items-center justify-between w-full max-w-7xl mx-auto py-2 px-4">
                    <HiMenuAlt1 className="text-xl text-neutral-content/90 cursor-pointer" />

                    <div className="flex flex-row items-center gap-2">
                        <a href='https://github.com/rotisserie-christian' target='_blank' rel='noreferrer'>
                            <button className="btn btn-neutral btn-circle">
                                <FaGithub className="text-xl" />
                            </button>
                        </a>

                        <a href='https://linkedin.com/in/cwaters123' target='_blank' rel='noreferrer'>
                            <button className="btn btn-neutral btn-circle">
                                <FaLinkedin className="text-xl" />
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}