import { FaAngleDoubleRight, FaMusic } from "react-icons/fa";
import PropTypes from "prop-types";

const VisualizerGate = ({ onLoadDemo }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6">
            <div className="flex flex-col gap-4 w-full px-8 lg:px-12">
                <button
                    onClick={onLoadDemo}
                    className="btn btn-lg text-cyan-200 rounded-xl ubuntu-bold"
                >
                    Load Demo <FaMusic />
                </button>

                <a
                    href='https://crayonbrain.com/create'
                    target='_blank' rel='noreferrer'
                    className="btn btn-lg rounded-xl ubuntu-bold"
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
