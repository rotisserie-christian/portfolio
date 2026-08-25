import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaMinus, FaPlus } from "react-icons/fa";
import { cn } from "@/utils/cn";

export const paragraphClass = "text-base mt-4 ubuntu-regular text-neutral-content/75 text-left";

export function ProjectLink({ href, label, className }) {
    const classes = cn("btn btn-outline border-cyan-200/25 border-2 mt-4 text-cyan-100", className);
    const content = (
        <>
            {label}
            <FaArrowRight />
        </>
    );

    if (href.startsWith("/")) {
        return (
            <Link to={href} className={classes}>
                {content}
            </Link>
        );
    }

    return (
        <a href={href} target="_blank" rel="noreferrer" className={classes}>
            {content}
        </a>
    );
}

export function ExpandableRow({ title, children }) {
    const [isOpen, setIsOpen] = useState(false);
    const buttonLabel = isOpen ? `Collapse ${title}` : `Expand ${title}`;

    return (
        <div className="w-full">
            <button
                type="button"
                className="flex flex-row items-center gap-3 lg:gap-4 w-full cursor-pointer"
                aria-expanded={isOpen}
                aria-label={buttonLabel}
                onClick={() => setIsOpen((open) => !open)}
            >
                <h3 className="text-lg lg:text-xl text-neutral-content/85 ubuntu-semibold text-left min-w-0">
                    {title}
                </h3>
                <div className="flex-1 h-px bg-neutral-content/20 min-w-4" aria-hidden="true" />
                <span className="btn btn-square btn-outline border-neutral-content/10 border-2 shrink-0 pointer-events-none">
                    {isOpen ? <FaMinus className="text-neutral-content/85" /> : <FaPlus className="text-neutral-content/85" />}
                </span>
            </button>

            {isOpen && (
                <div className="mb-2">
                    {children}
                </div>
            )}
        </div>
    );
}
