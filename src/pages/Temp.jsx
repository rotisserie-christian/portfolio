import CensusTable from "@/components/semanticmaps/ui/CensusTable";

export default function Temp() {
    return (
        <section className="flex items-center justify-center w-full bg-base-300 py-20 px-2 min-h-screen font-ubuntu">
            <div className="w-full max-w-4xl mx-2">
                <div className="w-full my-8 flex flex-col items-center justify-center gap-5">
                    <div className="w-full min-w-0">
                        <CensusTable />
                    </div>
                    <p className="ubuntu-regular text-xs text-neutral-content/60 text-center mt-16">
                        This product uses the Census Bureau Data API but is not endorsed or certified by the Census Bureau
                    </p>
                </div>
            </div>
        </section>
    );
}
