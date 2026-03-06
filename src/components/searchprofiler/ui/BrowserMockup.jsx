import DrumMetadata from "./DrumMetadata";
import VisualsMetadata from "./VisualsMetadata";
import TechnoMetadata from "./TechnoMetadata";
import HouseMetadata from "./HouseMetadata";

export default function BrowserMockup({ param }) {
    const components = {
        'drum-pad': DrumMetadata,
        'visualizer': VisualsMetadata,
        'techno': TechnoMetadata,
        'house': HouseMetadata
    };

    const ActiveComponent = components[param];

    return (
        <div className="mockup-browser border-base-300 border w-full">
            <div className="mockup-browser-toolbar">
                <div className="input border border-base-300">https://crayonbrain.com/?t={param}</div>
            </div>

            <div className="grid place-content-center border-t border-base-300 h-80">
                {ActiveComponent ? <ActiveComponent /> : "Hello!"}
            </div>
        </div>
    );
}
