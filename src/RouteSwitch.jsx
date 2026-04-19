import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from '@/App';
import Home from '@/pages/Home';
import AgTech from '@/pages/AgTech';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import Temp from './pages/Temp';

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <ErrorBoundary name="Portfolio App">
                <Routes>
                    <Route path="/" element={<App />}>
                        <Route index element={<Home />} />
                        <Route path="agtech" element={<AgTech />} />
                        <Route path="temp" element={<Temp />} />
                    </Route>
                </Routes>
            </ErrorBoundary>
        </BrowserRouter>
    );
};

export default RouteSwitch;