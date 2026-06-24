// Golden-angle hue stepping gives visually distinct colors for any number of chart lines
export const getSeriesColors = (labels = []) => {
    const map = {};
    labels.forEach((label, index) => {
        const hue = (index * 137.508) % 360;
        map[label] = `hsla(${hue}, 70%, 50%, 1)`;
    });
    return map;
};
