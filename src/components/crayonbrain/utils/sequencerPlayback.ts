const stopHandlers = new Map<number, () => void>();
let nextId = 0;

export const createSequencerInstanceId = (): number => {
  nextId += 1;
  return nextId;
};

export const registerSequencerStop = (id: number, stop: () => void): (() => void) => {
  stopHandlers.set(id, stop);
  return () => {
    stopHandlers.delete(id);
  };
};

export const stopOtherSequencers = (id: number): void => {
  stopHandlers.forEach((stop, otherId) => {
    if (otherId !== id) stop();
  });
};
