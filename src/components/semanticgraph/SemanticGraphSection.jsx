import { Suspense, lazy } from "react";
const SemanticGraph = lazy(() => import('./SemanticGraph'));
import GraphLegend from "./GraphLegend";

export default function SemanticGraphSection({ shouldStart = false }) {

    return (
        <section className="flex items-center justify-center w-full min-h-screen">
            <div className="flex flex-col mb-20 md:mb-32 lg:mb-40 items-center justify-center w-full">                
                <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold">
                    Semantic Graph
                </h1>

                <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/80 text-center max-w-xs lg:max-w-lg">
                    A 3D force graph that visualizes semantic similarity
                </p>

                <Suspense 
                    fallback={
                        <div className="flex items-center justify-center h-[330px]">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                    }>
                    <SemanticGraph shouldStart={shouldStart} />
                </Suspense>

                <GraphLegend />
            </div>
        </section>
    );
}
