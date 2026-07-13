import { useEffect, useState } from 'react';
import ScrollableTabBar from './ScrollableTabBar';

/**
 * Sticky jump-to-section nav that pins under the site navbar while scrolling.
 *
 * @param {{ id: string, label: string }[]} sections
 * @param {string} [className]
 * @param {'underline' | 'pill'} [variant]
 */
export default function SectionNav({
    sections,
    className = '',
    variant = 'underline',
}) {
    const [activeTab, setActiveTab] = useState(sections[0]?.id ?? '');

    useEffect(() => {
        const elements = sections
            .map((s) => document.getElementById(s.id))
            .filter(Boolean);

        if (!elements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visible[0]?.target?.id) {
                    setActiveTab(visible[0].target.id);
                }
            },
            {
                // Account for sticky navbar + this bar sitting underneath
                rootMargin: '-80px 0px -55% 0px',
                threshold: [0, 0.1, 0.25, 0.5],
            }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [sections]);

    const handleTabChange = (id) => {
        setActiveTab(id);
        document.getElementById(id)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    return (
        <div
            className={`sticky top-14 z-40 w-full bg-base-300/90 backdrop-blur-sm py-1 ${className}`}
        >
            <ScrollableTabBar
                tabs={sections}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                variant={variant}
            />
        </div>
    );
}
