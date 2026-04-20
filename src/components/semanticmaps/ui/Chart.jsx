import { useMemo } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { getClusterColors } from '../utils/colors';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

export default function Chart({ 
    dataOverride, 
    xKey = 'max_interest', 
    yKey = 'avg_interest', 
    labelKey = 'query', 
    clusterKey = 'cluster',
    xAxisLabel = 'Max Interest',
    yAxisLabel = 'Average Interest',
    maxRangeX = 100,
    maxRangeY = 100,
    colorMap: providedColorMap
}) {
  const dataToUse = useMemo(() => dataOverride || [], [dataOverride]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    clip: false,
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 10,
        left: 10
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#a6adbb',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const point = context.raw;
            return `${point.label}: ${xAxisLabel} ${point.x}, ${yAxisLabel} ${point.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: yAxisLabel,
          color: '#a6adbb'
        },
        grid: {
          color: '#2a323c'
        },
        ticks: {
          color: '#a6adbb'
        },
        beginAtZero: true,
        max: maxRangeY,
      },
      x: {
        title: {
          display: true,
          text: xAxisLabel,
          color: '#a6adbb'
        },
        grid: {
          color: '#2a323c'
        },
        ticks: {
          color: '#a6adbb'
        },
        beginAtZero: true,
        max: maxRangeX,
      },
    },
  }), [xAxisLabel, yAxisLabel, maxRangeX, maxRangeY]);

  const colorMap = useMemo(() => {
    if (providedColorMap) return providedColorMap;
    const uniqueClusters = [...new Set(dataToUse.map(item => item[clusterKey]))].sort();
    return getClusterColors(uniqueClusters);
  }, [dataToUse, clusterKey, providedColorMap]);

  const data = useMemo(() => {
    const clusters = {};
    dataToUse.forEach((item) => {
      const clusterVal = item[clusterKey];
      if (!clusters[clusterVal]) {
        clusters[clusterVal] = [];
      }
      clusters[clusterVal].push({
        x: item[xKey],
        y: item[yKey],
        r: 10,
        label: item[labelKey]
      });
    });

    const datasets = Object.keys(clusters).map((cluster) => {
      return {
        label: cluster,
        data: clusters[cluster],
        backgroundColor: colorMap[cluster]?.bg || '#888',
        borderColor: colorMap[cluster]?.border || '#888',
      };
    });

    return { datasets };
  }, [dataToUse, colorMap, xKey, yKey, labelKey, clusterKey]);

  const legendMargin = useMemo(() => ({
    id: 'legendMargin',
    beforeInit(chart) {
      const originalFit = chart.legend.fit;
      chart.legend.fit = function fit() {
        originalFit.bind(chart.legend)();
        this.height += 40;
      };
    }
  }), []);

  return (
    <div className="p-4 w-full h-[450px] bg-base-300">
      <Bubble options={options} data={data} plugins={[legendMargin]} redraw={true} />
    </div>
  );
}