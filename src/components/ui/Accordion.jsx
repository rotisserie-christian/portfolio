import { FaAngleRight, FaAngleUp } from "react-icons/fa";
import { useState } from "react";
import PropTypes from "prop-types";

const Accordion = ({
    title,
    titleClassName = "ubuntu-bold",
    bgClassName = "bg-base-300",
    children,
    defaultOpen = false,
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <>
            <div
                role="button"
                className={`flex flex-col items-center justify-center ${bgClassName} rounded-xl shadow-sm py-4 mb-2 w-full cursor-pointer`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex flex-row items-center px-4 justify-between w-full">
                    <h2 className={`text-xl lg:text-2xl text-neutral-content/75 flex items-center ${titleClassName}`}>
                        {title}
                    </h2>

                    {!isOpen ? (
                        <FaAngleRight className="text-neutral-content/75 text-3xl shrink-0" />
                    ) : (
                        <FaAngleUp className="text-neutral-content/75 text-3xl shrink-0" />
                    )}
                </div>
            </div>

            {isOpen && children}
        </>
    );
};

Accordion.propTypes = {
    title: PropTypes.node.isRequired,
    titleClassName: PropTypes.string,
    bgClassName: PropTypes.string,
    children: PropTypes.node,
    defaultOpen: PropTypes.bool,
};

export default Accordion;
