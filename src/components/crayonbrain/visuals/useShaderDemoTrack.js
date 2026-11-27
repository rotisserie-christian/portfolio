import { useCallback, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import {
  createSequencerInstanceId,
  hasOtherSequencers,
  registerSequencerStop,
  stopOtherSequencers,
} from '@/components/crayonbrain/utils/sequencerPlayback';
import kick from '@/assets/kick.wav';
import snare from '@/assets/snare.wav';
import snare2 from '@/assets/snare2.wav';
import hat from '@/assets/hat.wav';
import hat2 from '@/assets/hat2.wav';
import {
  DEMO_DRUM_SEQUENCE,
  DEMO_LEAD_ID,
  DEMO_MELODY,
  DEMO_TRACK_BPM,
  DEMO_TRACK_FILE_NAME,
  DEMO_TRACK_STEPS,
  DEMO_TRACK_STEPS_PER_BAR,
} from './demoTrack';
import {
  LOGOPULSE_FFT_SIZE,
  LOGOPULSE_FFT_SMOOTHING,
  LOGOPULSE_MAX_DB,
  LOGOPULSE_MIN_DB,
} from './logopulse/logoPulseConstants';

const STEP_SECONDS = (60 / DEMO_TRACK_BPM) * (4 / DEMO_TRACK_STEPS_PER_BAR);

export const HYPNOSIS_DEMO_DURATION = STEP_SECONDS * DEMO_TRACK_STEPS;

/** Schedule the part a hair ahead of the current Transport tick so the first hit is not already in the past. */
const ARM_AHEAD_SECONDS = 0.05;

const DRUMS = [
  { id: 'kick', src: kick },
  { id: 'snare', src: snare },
  { id: 'snare2', src: snare2 },
  { id: 'hat', src: hat },
  { id: 'hat2', src: hat2 },
];

const buildEvents = () => {
  const events = [];
  DEMO_DRUM_SEQUENCE.forEach((track) => {
    track.steps.forEach((on, step) => {
      if (on) events.push({ time: step * STEP_SECONDS, kind: 'drum', id: track.id });
    });
  });
  (DEMO_MELODY[DEMO_LEAD_ID] || []).forEach((note) => {
    events.push({
      time: note.step * STEP_SECONDS,
      kind: 'note',
      pitch: note.pitch,
      duration: Math.max(0.05, (note.duration || 1) * STEP_SECONDS),
    });
  });
  return events;
};

const EVENTS = buildEvents();

/**
 * The crayonbrain demo loop: four bars of drums plus the triangle lead.
 * The mix feeds the ripple FFT and the logo ring. The lead alone feeds
 * the ripple waveform figure. Playback is scheduled on the shared
 * Transport clock, and that clock is left running while another
 * sequencer is mounted.
 */
export const useShaderDemoTrack = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const [shaderAnalyser, setShaderAnalyser] = useState(null);
  const [waveAnalyser, setWaveAnalyser] = useState(null);
  const [logoAnalyser, setLogoAnalyser] = useState(null);

  const graphRef = useRef(null);
  const instanceIdRef = useRef(0);
  const isPlayingRef = useRef(false);
  const isLoopingRef = useRef(true);
  const scrubbingRef = useRef(false);
  const currentTimeRef = useRef(0);
  const originRef = useRef({ transport: 0, offset: 0 });
  const stopRef = useRef(() => {});

  const rememberTime = useCallback((time) => {
    const next = Math.max(0, Math.min(time, HYPNOSIS_DEMO_DURATION));
    currentTimeRef.current = next;
    setCurrentTime(next);
  }, []);

  const stop = useCallback(() => {
    const graph = graphRef.current;
    scrubbingRef.current = false;
    try {
      graph?.part.stop();
      graph?.part.cancel(0);
      graph?.synth.releaseAll();
    } catch {
      // already stopped
    }
    if (isPlayingRef.current) {
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
    if (!hasOtherSequencers(instanceIdRef.current)) {
      try {
        if (Tone.getTransport().state !== 'stopped') Tone.getTransport().stop();
      } catch {
        // transport may already be stopped
      }
    }
  }, []);

  useEffect(() => {
    stopRef.current = stop;
  }, [stop]);

  const armPart = useCallback((offset) => {
    const graph = graphRef.current;
    if (!graph) return;
    const startAt = offset >= HYPNOSIS_DEMO_DURATION - 0.02 ? 0 : offset;
    Tone.getTransport().bpm.value = DEMO_TRACK_BPM;
    graph.part.loop = isLoopingRef.current;
    graph.part.loopEnd = HYPNOSIS_DEMO_DURATION;
    try {
      graph.part.stop();
      graph.part.cancel(0);
    } catch {
      // part has not been started yet
    }
    try {
      graph.synth.releaseAll();
    } catch {
      // synth already quiet
    }
    const startOn = Tone.getTransport().seconds + ARM_AHEAD_SECONDS;
    originRef.current = { transport: startOn, offset: startAt };
    graph.part.start(startOn, startAt);
    rememberTime(startAt);
  }, [rememberTime]);

  useEffect(() => {
    let disposed = false;
    const mix = new Tone.Gain(0.8).toDestination();
    const raw = Tone.getContext().rawContext;

    const shaderNode = raw.createAnalyser();
    shaderNode.fftSize = 2048;
    shaderNode.smoothingTimeConstant = 0.2;
    const logoNode = raw.createAnalyser();
    logoNode.fftSize = LOGOPULSE_FFT_SIZE;
    logoNode.smoothingTimeConstant = LOGOPULSE_FFT_SMOOTHING;
    logoNode.minDecibels = LOGOPULSE_MIN_DB;
    logoNode.maxDecibels = LOGOPULSE_MAX_DB;
    const leadNode = raw.createAnalyser();
    leadNode.fftSize = 2048;
    leadNode.smoothingTimeConstant = 0;
    mix.connect(shaderNode);
    mix.connect(logoNode);

    const players = {};
    DRUMS.forEach(({ id, src }) => {
      const player = new Tone.Player({ url: src, fadeOut: 0.01 });
      player.connect(mix);
      players[id] = player;
    });

    const synth = new Tone.PolySynth(Tone.Synth, {
      volume: -8,
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.14, sustain: 0.12, release: 0.22 },
    });
    const filter = new Tone.Filter(1600, 'lowpass');
    const leadGain = new Tone.Gain(0.32);
    synth.connect(filter);
    filter.connect(leadGain);
    leadGain.connect(mix);
    leadGain.connect(leadNode);

    const part = new Tone.Part((time, event) => {
      if (event.kind === 'drum') {
        const player = players[event.id];
        if (player?.loaded) player.start(time);
        return;
      }
      synth.triggerAttackRelease(event.pitch, event.duration, time);
    }, EVENTS);
    part.loop = true;
    part.loopStart = 0;
    part.loopEnd = HYPNOSIS_DEMO_DURATION;

    graphRef.current = { mix, players, synth, filter, leadGain, part };
    setShaderAnalyser(shaderNode);
    setWaveAnalyser(leadNode);
    setLogoAnalyser(logoNode);

    const instanceId = createSequencerInstanceId();
    instanceIdRef.current = instanceId;
    const unregister = registerSequencerStop(instanceId, () => stopRef.current());

    Tone.loaded().then(() => {
      if (!disposed) setIsInitializing(false);
    }).catch(() => {
      if (!disposed) setIsInitializing(false);
    });

    return () => {
      disposed = true;
      stopRef.current();
      unregister();
      try {
        part.dispose();
        synth.dispose();
        filter.dispose();
        leadGain.dispose();
        Object.values(players).forEach((player) => player.dispose());
        mix.dispose();
      } catch {
        // graph already torn down
      }
      [shaderNode, logoNode, leadNode].forEach((node) => {
        try {
          node.disconnect();
        } catch {
          // analyser was already disconnected
        }
      });
      graphRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) return undefined;
    const sync = () => {
      const transport = Tone.getTransport();
      if (transport.state !== 'started' || scrubbingRef.current) return;
      const elapsed = transport.seconds - originRef.current.transport;
      let time = originRef.current.offset + Math.max(0, elapsed);
      if (isLoopingRef.current) {
        time = ((time % HYPNOSIS_DEMO_DURATION) + HYPNOSIS_DEMO_DURATION) % HYPNOSIS_DEMO_DURATION;
        rememberTime(time);
        return;
      }
      if (time >= HYPNOSIS_DEMO_DURATION) {
        rememberTime(HYPNOSIS_DEMO_DURATION);
        stop();
        return;
      }
      rememberTime(time);
    };
    sync();
    const intervalId = setInterval(sync, 50);
    return () => clearInterval(intervalId);
  }, [isPlaying, rememberTime, stop]);

  const play = useCallback(async () => {
    if (isInitializing || !graphRef.current) return;
    if (isPlayingRef.current) {
      stop();
      return;
    }
    if (Tone.getContext().state !== 'running') {
      await Tone.start();
    }
    stopOtherSequencers(instanceIdRef.current);
    Tone.getTransport().bpm.value = DEMO_TRACK_BPM;
    if (Tone.getTransport().state !== 'started') {
      Tone.getTransport().start();
    }
    isPlayingRef.current = true;
    setIsPlaying(true);
    armPart(currentTimeRef.current);
  }, [armPart, isInitializing, stop]);

  const previewTime = useCallback((time) => {
    scrubbingRef.current = true;
    rememberTime(time);
  }, [rememberTime]);

  const seek = useCallback((time) => {
    scrubbingRef.current = false;
    const offset = Math.max(0, Math.min(time, HYPNOSIS_DEMO_DURATION));
    if (!isPlayingRef.current || !graphRef.current) {
      rememberTime(offset);
      return;
    }
    armPart(offset);
  }, [armPart, rememberTime]);

  const restart = useCallback(() => {
    seek(0);
  }, [seek]);

  const toggleLoop = useCallback(() => {
    const next = !isLoopingRef.current;
    isLoopingRef.current = next;
    setIsLooping(next);
    if (graphRef.current) graphRef.current.part.loop = next;
  }, []);

  return {
    fileName: DEMO_TRACK_FILE_NAME,
    duration: HYPNOSIS_DEMO_DURATION,
    isPlaying,
    isLooping,
    currentTime,
    isInitializing,
    shaderAnalyser,
    waveAnalyser,
    logoAnalyser,
    play,
    previewTime,
    seek,
    restart,
    toggleLoop,
  };
};
