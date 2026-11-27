import { useRef } from 'react';
import PropTypes from 'prop-types';
import { FaPlay, FaStop, FaUndo } from 'react-icons/fa';
import { MdLoop } from 'react-icons/md';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const formatTime = (seconds) => {
  const safe = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  const mins = Math.floor(safe / 60);
  const secs = Math.floor(safe % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const ShaderControls = ({
  fileName = 'Demo track',
  isPlaying = false,
  isLooping = true,
  isInitializing = false,
  currentTime = 0,
  duration = 0,
  onPlay,
  onRestart,
  onToggleLoop,
  onScrub,
  onScrubPreview,
}) => {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const clampedTime = Math.min(Math.max(currentTime, 0), safeDuration || 0);
  const pendingScrubRef = useRef(null);

  const finishScrub = () => {
    if (pendingScrubRef.current === null) return;
    const time = pendingScrubRef.current;
    pendingScrubRef.current = null;
    onScrub?.(time);
  };

  return (
    <div className="flex h-full flex-col justify-center gap-4 rounded-xl bg-base-200/40 p-4">
      <div>
        <p className="text-lg text-neutral-content/85 ubuntu-semibold">{fileName}</p>
        <p className="text-sm text-neutral-content/60">
          {formatTime(clampedTime)} / {formatTime(safeDuration)}
        </p>
      </div>

      <div className="flex flex-row flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onPlay}
          disabled={isInitializing}
          className={`btn bg-base-200 rounded-lg shadow-md ${isPlaying ? 'text-red-300' : 'text-cyan-200'}`}
          aria-label={isPlaying ? 'Stop demo track' : 'Play demo track'}
        >
          {isInitializing ? (
            <LoadingSpinner size="sm" label="Loading demo track" />
          ) : (
            <>
              {isPlaying ? <FaStop className="mr-1" /> : <FaPlay className="mr-1" />}
              {isPlaying ? 'Stop' : 'Play'}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onRestart}
          disabled={isInitializing}
          className="btn bg-base-200 rounded-lg shadow-md text-neutral-content/85"
          aria-label="Restart demo track"
        >
          <FaUndo className="mr-1" />
          Restart
        </button>

        <button
          type="button"
          onClick={onToggleLoop}
          className={`btn btn-sm rounded-lg bg-base-200 ${isLooping ? 'border-2 border-primary text-blue-300/85' : ''}`}
          aria-pressed={isLooping}
          aria-label={isLooping ? 'Turn loop off' : 'Turn loop on'}
        >
          <MdLoop className="text-lg" />
          Loop
        </button>
      </div>

      <div className="w-full">
        <input
          type="range"
          min={0}
          max={safeDuration}
          step={0.01}
          value={clampedTime}
          onPointerDown={(event) => {
            pendingScrubRef.current = Number(event.currentTarget.value);
            event.currentTarget.setPointerCapture?.(event.pointerId);
            onScrubPreview?.(pendingScrubRef.current);
          }}
          onChange={(event) => {
            const time = Number(event.target.value);
            if (pendingScrubRef.current === null) {
              onScrub?.(time);
              return;
            }
            pendingScrubRef.current = time;
            onScrubPreview?.(time);
          }}
          onPointerUp={finishScrub}
          onPointerCancel={finishScrub}
          onLostPointerCapture={finishScrub}
          disabled={isInitializing || !safeDuration}
          className="range range-primary range-xs w-full"
          aria-label="Seek demo track"
        />
      </div>
    </div>
  );
};

ShaderControls.propTypes = {
  fileName: PropTypes.string,
  isPlaying: PropTypes.bool,
  isLooping: PropTypes.bool,
  isInitializing: PropTypes.bool,
  currentTime: PropTypes.number,
  duration: PropTypes.number,
  onPlay: PropTypes.func,
  onRestart: PropTypes.func,
  onToggleLoop: PropTypes.func,
  onScrub: PropTypes.func,
  onScrubPreview: PropTypes.func,
};

export default ShaderControls;
