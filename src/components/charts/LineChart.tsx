import { ResponsiveLine } from '@nivo/line';
import { motion } from 'framer-motion';

interface DataPoint {
  x: string | number;
  y: number;
}

interface LineChartProps {
  data: {
    id: string;
    data: DataPoint[];
  }[];
  title: string;
}

export function LineChart({ data, title }: LineChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="h-80">
        <ResponsiveLine
          data={data}
          margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
          curve="monotoneX"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: '#9CA3AF',
                  fontSize: 12,
                },
              },
            },
            grid: {
              line: {
                stroke: '#374151',
                strokeWidth: 1,
              },
            },
            crosshair: {
              line: {
                stroke: '#4ADE80',
                strokeWidth: 1,
                strokeOpacity: 0.35,
              },
            },
          }}
        />
      </div>
    </motion.div>
  );
} 