import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

export default function ScrollBar({
    clusters,
    activeCluster,
    onClusterSelect,
    className = ''
}) {
    const tabsContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        const container = tabsContainerRef.current;
        if (!container) return;

        const updateScrollState = () => {
            setCanScrollLeft(container.scrollLeft > 0);
            setCanScrollRight(
                container.scrollLeft < (container.scrollWidth - container.clientWidth - 1)
            );
        };

        updateScrollState();
        container.addEventListener('scroll', updateScrollState);
        window.addEventListener('resize', updateScrollState);

        return () => {
            container.removeEventListener('scroll', updateScrollState);
            window.removeEventListener('resize', updateScrollState);
        };
    }, [clusters]);

    const scroll = (direction) => {
        if (tabsContainerRef.current) {
            const container = tabsContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleWheel = (e) => {
        if (tabsContainerRef.current) {
            const container = tabsContainerRef.current;
            if (container.scrollWidth > container.clientWidth) {
                e.preventDefault();
                container.scrollLeft += e.deltaY;
            }
        }
    };

    const isFirstRender = useRef(true);

    // Scroll active tab into view
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (tabsContainerRef.current && activeCluster) {
            const activeTab = tabsContainerRef.current.querySelector(`[data-cluster-id="${activeCluster}"]`);
            if (activeTab) {
                activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [activeCluster]);

    return (
        <div className={`w-full bg-base-300 border-b border-base-content/10 ${className}`}>
            <div className="flex items-center justify-center">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll('left')}
                    disabled={!canScrollLeft}
                    className={`p-3 flex-shrink-0 transition-all duration-200 ${!canScrollLeft ? 'opacity-20 cursor-not-allowed' : 'hover:bg-base-200 cursor-pointer'
                        }`}
                >
                    <FaAngleLeft className="w-4 h-4" />
                </button>

                {/* Scrollable Container */}
                <div
                    ref={tabsContainerRef}
                    onWheel={handleWheel}
                    className="flex-1 overflow-x-auto scrollbar-hide select-none py-2"
                >
                    <div className="flex flex-row items-center lg:justify-center gap-2 px-4 whitespace-nowrap">
                        <button
                            data-cluster-id="all"
                            onClick={() => onClusterSelect('all')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${activeCluster === 'all'
                                ? 'border-2 border-purple-100/80 text-purple-100/85 shadow-md'
                                : 'text-base-content/60 hover:text-base-content hover:bg-base-200'
                                }`}
                        >
                            All
                        </button>

                        {clusters.map((cluster) => (
                            <button
                                key={cluster}
                                data-cluster-id={cluster}
                                onClick={() => onClusterSelect(cluster)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${activeCluster === cluster
                                    ? 'border-2 border-purple-100/80 text-purple-100/85 shadow-md'
                                    : 'text-base-content/60 hover:text-base-content hover:bg-base-200'
                                    }`}
                            >
                                {cluster}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll('right')}
                    disabled={!canScrollRight}
                    className={`p-3 flex-shrink-0 transition-all duration-200 ${!canScrollRight ? 'opacity-20 cursor-not-allowed' : 'hover:bg-base-200 cursor-pointer'
                        }`}
                >
                    <FaAngleRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

ScrollBar.propTypes = {
    clusters: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeCluster: PropTypes.string.isRequired,
    onClusterSelect: PropTypes.func.isRequired,
    className: PropTypes.string
};