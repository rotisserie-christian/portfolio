import ReviewsChart from "@/components/semanticmaps/ui/ReviewsChart";
import ReviewsTable from "@/components/semanticmaps/ui/ReviewsTable";

export default function Temp() {
    return (
        <section className="flex items-center justify-center w-full bg-base-300 py-20 px-2 min-h-screen font-ubuntu">
            <div className="w-full max-w-4xl mx-2">
                <div className="w-full my-8 flex flex-col items-center justify-center gap-5">
                    <div className="w-full lg:w-1/2 min-w-0">
                        <ReviewsChart />
                    </div>
                    <div className="w-full lg:w-1/2 min-w-0">
                        <ReviewsTable />
                    </div>
                </div>
            </div>
        </section>
    );
}
