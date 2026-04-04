import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import AgTech from './pages/AgTech';

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<Home />} />
                    <Route path="agtech" element={<AgTech />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default RouteSwitch;