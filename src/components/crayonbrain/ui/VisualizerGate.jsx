import { FaAngleDoubleRight } from "react-icons/fa";
import PropTypes from "prop-types";

const VisualizerGate = ({ onLoadDemo }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6">
            <div className="flex flex-col gap-4 px-8 lg:px-12">
                <button
                    onClick={onLoadDemo}
                    className="btn text-cyan-200 rounded-lg ubuntu-bold"
                >
                    Load Demo
                </button>

                <a
                    href='https://crayonbrain.com/create'
                    target='_blank' rel='noreferrer'
                    className="btn rounded-lg text-base-content/90 ubuntu-bold"
                >
                    Visit Site <FaAngleDoubleRight />
                </a>
            </div>
        </div>
    );
};

VisualizerGate.propTypes = {
    onLoadDemo: PropTypes.func.isRequired,
};

export default VisualizerGate;
