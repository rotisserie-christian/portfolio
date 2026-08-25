import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from '@/App';
import Home from '@/pages/home/Home';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import Temp from './pages/Temp';
import Trends from './pages/Trends';
import Prerendering from './pages/Prerendering';

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <ErrorBoundary name="Portfolio App">
                <Routes>
                    <Route path="/" element={<App />}>
                        <Route index element={<Home />} />
                        <Route path="semanticmaps" element={<Home />} />
                        <Route path="temp" element={<Temp />} />
                        <Route path="trends" element={<Trends />} />
                        <Route path="prerendering" element={<Prerendering />} />
                    </Route>
                </Routes>
            </ErrorBoundary>
        </BrowserRouter>
    );
};

export default RouteSwitch;