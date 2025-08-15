import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 backdrop-blur-sm w-full bg-base-100/80 shadow-md">
            <div className="flex items-center justify-center w-full">
                <div className="flex flex-row items-center justify-between w-full max-w-7xl py-2 px-4">
                    <a href='https://github.com/rotisserie-christian' target='_blank' rel='noreferrer'>
                        <button 
                        className="btn btn-neutral rounded-xl text-neutral-content/85">
                            <FaGithub />Github
                        </button>
                    </a>

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