import HypnosisControls from '@/components/crayonbrain/visuals/HypnosisControls';
import HypnosisVisual from '@/components/crayonbrain/visuals/HypnosisVisual';
import { useHypnosisDemoTrack } from '@/components/crayonbrain/visuals/useHypnosisDemoTrack';

export default function HypnosisDemo() {
  const track = useHypnosisDemoTrack();

  return (
    <div className="mt-4 flex w-full flex-col items-stretch gap-4 lg:flex-row">
      <div className="relative h-[500px] w-full overflow-hidden rounded-xl bg-black lg:w-1/2">
        <HypnosisVisual
          isPlaying={track.isPlaying}
          shaderAnalyser={track.shaderAnalyser}
          waveAnalyser={track.waveAnalyser}
          logoAnalyser={track.logoAnalyser}
        />
      </div>
      <div className="w-full lg:w-1/2">
        <HypnosisControls
          fileName={track.fileName}
          isPlaying={track.isPlaying}
          isLooping={track.isLooping}
          isInitializing={track.isInitializing}
          currentTime={track.currentTime}
          duration={track.duration}
          onPlay={track.play}
          onRestart={track.restart}
          onToggleLoop={track.toggleLoop}
          onScrub={track.seek}
          onScrubPreview={track.previewTime}
        />
      </div>
    </div>
  );
}
