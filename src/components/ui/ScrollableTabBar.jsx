import { useRef, useEffect, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const TAB_VARIANTS = {
    underline: {
        base: 'flex items-center gap-2 px-3 py-2 text-sm ubuntu-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 justify-center',
        active: 'border-b-2 border-cyan-200/70 text-cyan-200',
        inactive: 'border-b-2 border-transparent text-neutral-content/60 hover:text-neutral-content/85',
    },
    pill: {
        base: 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm ubuntu-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 justify-center',
        active: 'border-2 border-cyan-200/50 text-cyan-200/80',
        inactive: 'border-2 border-transparent text-neutral-content/60 hover:text-neutral-content/85',
    },
};

/**
 * Horizontally scrollable tab strip with overflow arrows.
 *
 * @param {{ id: string, label: string, icon?: React.ReactNode }[]} tabs
 * @param {string} activeTab
 * @param {(id: string) => void} onTabChange
 * @param {string} [className]
 * @param {'underline' | 'pill'} [variant]
 * @param {boolean} [enableWheelScroll] - map vertical wheel to horizontal scroll when overflowing
 */
export default function ScrollableTabBar({
    tabs,
    activeTab,
    onTabChange,
    className = '',
    variant = 'underline',
    enableWheelScroll = false,
}) {
    const tabsContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const container = tabsContainerRef.current;
        if (!container) return;

        const updateScrollState = () => {
            const overflowing = container.scrollWidth > container.clientWidth;
            setIsOverflowing(overflowing);
            setCanScrollLeft(container.scrollLeft > 0);
            setCanScrollRight(
                Math.ceil(container.scrollLeft + container.clientWidth) < container.scrollWidth
            );
        };

        updateScrollState();
        container.addEventListener('scroll', updateScrollState);
        window.addEventListener('resize', updateScrollState);

        const resizeObserver = new ResizeObserver(updateScrollState);
        resizeObserver.observe(container);

        return () => {
            container.removeEventListener('scroll', updateScrollState);
            window.removeEventListener('resize', updateScrollState);
            resizeObserver.disconnect();
        };
    }, [tabs]);

    const scrollActiveTabIntoView = (tabId) => {
        const container = tabsContainerRef.current;
        if (!container) return;
        const activeTabElement = container.querySelector(`[data-tab-id="${tabId}"]`);
        activeTabElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };

    const handleTabClick = (tabId) => {
        onTabChange(tabId);
        scrollActiveTabIntoView(tabId);
    };

    const scrollByPage = (direction) => {
        const container = tabsContainerRef.current;
        if (!container) return;
        container.scrollBy({
            left: direction * container.clientWidth * 0.6,
            behavior: 'smooth',
        });
    };

    const handleWheel = (e) => {
        if (!enableWheelScroll || !tabsContainerRef.current) return;
        const container = tabsContainerRef.current;
        if (container.scrollWidth <= container.clientWidth) return;
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            container.scrollLeft += e.deltaY;
        }
    };

    const tabStyles = TAB_VARIANTS[variant] ?? TAB_VARIANTS.underline;
    const arrowBase =
        'absolute top-0 bottom-0 z-10 flex items-center px-1 transition-all duration-200';
    const arrowHidden = 'opacity-0 pointer-events-none';
    const arrowVisible = 'text-neutral-content/70 hover:text-neutral-content cursor-pointer';

    return (
        <div className={`relative w-full max-w-full min-w-0 ${className}`}>
            <div
                ref={tabsContainerRef}
                className={`w-full overflow-x-auto flex flex-row items-center gap-1 py-1 scroll-smooth ${
                    isOverflowing ? 'justify-start' : 'justify-center'
                }`}
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch',
                }}
                onWheel={handleWheel}
            >
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            data-tab-id={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`${tabStyles.base} ${isActive ? tabStyles.active : tabStyles.inactive}`}
                        >
                            {tab.icon && <span className="text-lg">{tab.icon}</span>}
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={() => scrollByPage(-1)}
                disabled={!canScrollLeft}
                className={`${arrowBase} left-0 rounded-l-lg bg-gradient-to-r from-base-300 via-base-300/70 to-transparent ${
                    canScrollLeft ? arrowVisible : arrowHidden
                }`}
                aria-label="Scroll left"
            >
                <FaAngleLeft className="w-4 h-4" />
            </button>

            <button
                type="button"
                onClick={() => scrollByPage(1)}
                disabled={!canScrollRight}
                className={`${arrowBase} right-0 rounded-r-lg bg-gradient-to-l from-base-300 via-base-300/70 to-transparent ${
                    canScrollRight ? arrowVisible : arrowHidden
                }`}
                aria-label="Scroll right"
            >
                <FaAngleRight className="w-4 h-4" />
            </button>
        </div>
    );
}
