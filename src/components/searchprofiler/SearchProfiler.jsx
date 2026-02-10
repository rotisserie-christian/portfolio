import { FaAngleDoubleRight, FaPython } from "react-icons/fa";
import Chart from "./Chart";

export default function SearchProfiler() {
    return (
        <section className="flex items-center justify-center w-full bg-base-300">
            <div className="flex flex-col items-center justify-center w-full">
                <div className="flex flex-col mt-20 mb-10 lg:mb-16 items-center justify-center w-full">
                    <h1 className="ubuntu-bold text-3xl lg:text-5xl text-neutral-content/85">
                        Search Profiler
                    </h1>

                    <div className="flex flex-row items-center justify-center w-24 h-8 bg-base-100 rounded-lg gap-2 mt-4">
                        <FaPython className="text-xl text-neutral-content/85" />
                        <p className="text-xs text-neutral-content/85">Python</p>
                    </div>

                    <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                        Toolkit for researching search terms specific to the behaviour of a given user profile
                    </p>

                    <a
                        href='https://github.com/rotisserie-christian/search-profiler'
                        target='_blank' rel='noreferrer'>
                        <button className="btn w-26 bg-neutral rounded-xl mt-4 mb-8">
                            GitHub<FaAngleDoubleRight />
                        </button>
                    </a>
                </div>

                <Chart />
            </div>
        </section>
    );
}