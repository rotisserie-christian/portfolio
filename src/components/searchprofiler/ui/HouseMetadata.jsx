export default function HouseMetadata() {
    return (
        <div className="flex flex-col items-start justify-center w-full px-4">
            <p className="courier-new text-emerald-600 mb-10">// Loads into studio with the drum pad active</p>
            <p className="courier-new">'drum-pad' : {`{`}</p>
            <p className="courier-new ml-10">title: "Online Drum Pad",</p>
            <p className="courier-new ml-10">defaultTab: 'studio',</p>
            <p className="courier-new ml-10">defaultPattern: 'drums'</p>
            <p className="courier-new">{'},'}</p>
        </div>
    )
}
