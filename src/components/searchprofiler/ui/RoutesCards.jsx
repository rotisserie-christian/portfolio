
export default function RoutesCards() {

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-2">
            <div className="flex flex-col items-center justify-center rounded-lg bg-base-200 p-4 border-base-300 w-full max-w-[360px]">
                <h1 className="ubuntu-bold text-2xl text-neutral-content/85 mt-6">Drum Pad</h1>

                <p className="ubuntu-medium text-base text-center text-neutral-content/85 w-64 mt-4">
                    Opens to the Studio tab with the drum machine active
                </p>

                <p className="ubuntu-medium text-base underline text-cyan-200/90 cursor-pointer mt-8 mb-4">
                    <a href="https://crayonbrain.com/create?t=drum-pad" target="_blank" rel="noreferrer">
                        crayonbrain.com/create?t=drum-pad
                    </a>
                </p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg p-4 bg-base-200 border-base-300 w-full max-w-[360px]">
                <h1 className="ubuntu-bold text-2xl text-neutral-content/85 mt-6">Visualizer</h1>

                <p className="ubuntu-medium text-base text-center text-neutral-content/85 w-64 mt-4">
                    Opens to the Live tab with the visualizer active
                </p>

                <p className="ubuntu-medium text-base text-cyan-200/90 underline cursor-pointer mt-8 mb-4">
                    <a href="https://crayonbrain.com/create?t=drum-pad" target="_blank" rel="noreferrer">
                        crayonbrain.com/create?t=visualizer
                    </a>
                </p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg p-4 bg-base-200 border-base-300 w-full max-w-[360px]">
                <h1 className="ubuntu-bold text-2xl text-neutral-content/85 mt-6">House</h1>

                <p className="ubuntu-medium text-base text-center text-neutral-content/85 w-64 mt-4">
                    Opens to the Studio tab with a four to the floor pattern active
                </p>

                <p className="ubuntu-medium text-base text-cyan-200/90 underline cursor-pointer mt-8 mb-4">
                    <a href="https://crayonbrain.com/create?t=drum-pad" target="_blank" rel="noreferrer">
                        crayonbrain.com/create?t=house
                    </a>
                </p>
            </div>
        </div>
    );
}
