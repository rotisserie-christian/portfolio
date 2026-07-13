import { useLocation, useNavigate } from 'react-router-dom';

const HOME_PATHS = new Set(['/', '/semanticmaps', '/crayonbrain', '/contact']);

/**
 * Navigate to a Home page section. Scrolls in place when already on Home;
 * otherwise routes to `/` and passes scrollTo state for Home to pick up.
 */
export function useNavigateToSection() {
    const navigate = useNavigate();
    const location = useLocation();

    return (sectionId) => {
        if (HOME_PATHS.has(location.pathname)) {
            document.querySelector(`[data-section="${sectionId}"]`)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
            return;
        }

        navigate('/', { state: { scrollTo: sectionId } });
    };
}
