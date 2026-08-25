import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="mt-auto w-full py-12 bg-base-300 border-t border-white/5 flex flex-col items-center">
            <div className="flex flex-col items-center text-center px-6">
                <span className="text-xl ubuntu-bold text-neutral-content/90">Christian Waters</span>
                <div className="flex flex-row items-center gap-4 mt-3">
                    <a
                        href="https://linkedin.com/in/cwaters123"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="LinkedIn Profile"
                        className="flex items-center gap-2 underline text-neutral-content/75 hover:text-neutral-content ubuntu-regular"
                    >
                        <FaLinkedin className="text-lg" />
                        LinkedIn
                    </a>
                    <a
                        href="https://github.com/rotisserie-christian"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub Profile"
                        className="flex items-center gap-2 underline text-neutral-content/75 hover:text-neutral-content ubuntu-regular"
                    >
                        <FaGithub className="text-lg" />
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
