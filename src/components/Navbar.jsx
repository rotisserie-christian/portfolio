import { FaLinkedin } from "react-icons/fa";
import { HiMenuAlt1 } from "react-icons/hi";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 backdrop-blur-sm w-full bg-base-100/80 shadow-md">
            <div className="flex items-center justify-center w-full">
                <div className="flex flex-row items-center justify-between w-full max-w-7xl py-2 px-4">
                    <HiMenuAlt1 className="text-3xl text-neutral-content/85" />

                    <a href='https://linkedin.com/in/cwaters96' target='_blank' rel='noreferrer'>
                        <button 
                        className="btn btn-neutral rounded-xl text-neutral-content/85">
                            <FaLinkedin />Contact
                        </button>
                    </a>
                </div>
            </div>
        </nav>
    );
}