import cb from '@/assets/cb.png';

const Footer = () => {
    const scrollToSection = (sectionId) => {
        document.querySelector(`[data-section="${sectionId}"]`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    return (
        <footer className="w-full py-12 bg-base-300 border-t border-white/5 flex flex-col items-center">
            <div className="max-w-6xl w-full px-6 flex flex-col md:flex-row justify-between items-center gap-8 mb-4">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="flex items-center gap-2 mb-2">
                        <img src={cb} alt="Crayonbrain Logo" className="w-10 h-10" />
                        <span className="text-xl ubuntu-bold text-neutral-content/90">Christian Waters</span>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-10">
                    <div className="flex flex-col items-start md:items-start gap-2">
                        <h4 className="text-sm font-bold tracking-wider text-base-content/40 uppercase">Projects</h4>
                        <button onClick={() => scrollToSection('crayonbrain')} className="text-sm text-neutral-content/90 hover:text-cyan-400 transition-colors cursor-pointer ubuntu-regular">
                            Crayonbrain
                        </button>
                        <button onClick={() => scrollToSection('semanticmaps')} className="text-sm text-neutral-content/80 hover:text-cyan-400 transition-colors cursor-pointer ubuntu-regular">
                            Semantic Maps
                        </button>
                    </div>

                    <div className="flex flex-col items-start md:items-start gap-2">
                        <h4 className="text-sm font-bold tracking-wider text-base-content/40 uppercase">Links</h4>
                        <a href="https://linkedin.com/in/cwaters123" target="_blank" rel="noreferrer" className="text-sm text-neutral-content/90 hover:text-cyan-400 transition-colors cursor-pointer ubuntu-regular">
                            LinkedIn
                        </a>
                        <a href="https://github.com/rotisserie-christian" target="_blank" rel="noreferrer" className="text-sm text-neutral-content/90 hover:text-cyan-400 transition-colors cursor-pointer ubuntu-regular">
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;