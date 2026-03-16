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
import searchData from '../data/searchterms.json';
import { getClusterColors } from '../utils/colors';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

export default function Chart({ dataOverride }) {
  const dataToUse = dataOverride || searchData;

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#a6adbb', // base-content color
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const point = context.raw;
            return `${point.query}: Max ${point.x}, Avg ${point.y}, Slope ${point.slope}`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Average Interest',
          color: '#a6adbb'
        },
        grid: {
          color: '#2a323c' // base-300
        },
        ticks: {
          color: '#a6adbb'
        },
        beginAtZero: true,
        max: 100,
      },
      x: {
        title: {
          display: true,
          text: 'Max Interest',
          color: '#a6adbb'
        },
        grid: {
          color: '#2a323c'
        },
        ticks: {
          color: '#a6adbb'
        },
        beginAtZero: true,
        max: 100,
      },
    },
  }), []);

  // color map for clusters
  const colorMap = useMemo(() => getClusterColors(), []);

  const data = useMemo(() => {
    // Group data by cluster
    const clusters = {};
    dataToUse.forEach((item) => {
      if (!clusters[item.cluster]) {
        clusters[item.cluster] = [];
      }
      clusters[item.cluster].push({
        x: item.max_interest,
        y: item.avg_interest,
        r: (Math.max(0, item.slope || 0) * 180) + 8,
        query: item.query,
        slope: item.slope,
        max_interest: item.max_interest
      });
    });

    // datasets
    const datasets = Object.keys(clusters).map((cluster) => {
      return {
        label: cluster,
        data: clusters[cluster],
        backgroundColor: colorMap[cluster]?.bg || '#888',
        borderColor: colorMap[cluster]?.border || '#888',
      };
    });

    return { datasets };
  }, [dataToUse, colorMap]);

  const legendMargin = useMemo(() => ({
    id: 'legendMargin',
    beforeInit(chart) {
      const originalFit = chart.legend.fit;
      chart.legend.fit = function fit() {
        originalFit.bind(chart.legend)();
        this.height += 40; // padding bottom on legend 
      };
    }
  }), []);

  return (
    <div className="p-4 w-full h-[450px] bg-base-300">
      <Bubble options={options} data={data} plugins={[legendMargin]} redraw={true} />
    </div>
  );
}