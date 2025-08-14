export default function GraphLegend() {
    return (
        <div className='flex flex-col text-center items-center lg:w-full gap-4'>  
            <div className='flex flex-row items-center justify-center w-full gap-4'>
                <div className='flex flex-row items-center justify-start w-[120px] lg:w-[200px] bg-neutral gap-2 px-3 py-2 rounded-3xl shadow-md'>
                    <svg width="20" height="20">
                        <circle cx="10" cy="10" r="8" fill="cyan"/>
                    </svg>
                    <p className='text-sm lg:text-base font-medium'>Drums</p>
                </div>


                <div className='flex flex-row items-center justify-start bg-neutral w-[120px] lg:w-[200px] gap-2 px-3 py-2 rounded-3xl shadow-md'>
                    <svg width="20" height="20">
                        <circle cx="10" cy="10" r="8" fill="violet"/>
                    </svg>
                    <p className='text-sm lg:text-base ubuntu-regular'>Visuals</p>
                </div>
            </div>

            <div className='flex flex-row items-center justify-start bg-neutral w-[150px] lg:w-[200px] gap-2 px-3 py-2 rounded-3xl shadow-md'>
                <svg width="20" height="20">
                    <circle cx="10" cy="10" r="8" fill="orange"/>
                </svg>
                <p className='text-sm lg:text-base ubuntu-regular'>Instruments</p>
            </div>
        </div>
    );
};