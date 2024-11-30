import { ResponsivePie } from '@nivo/pie';

interface ChartData {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface StatisticsChartProps {
  data: ChartData[];
  height?: number;
}

export function StatisticsChart({ data, height = 300 }: StatisticsChartProps) {
  return (
    <div style={{ height }}>
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]]
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [['darker', 2]]
        }}
        theme={{
          background: 'transparent',
          text: {
            fill: '#333333'
          },
          tooltip: {
            container: {
              background: '#ffffff',
              color: '#333333',
              fontSize: '12px'
            }
          }
        }}
      />
    </div>
  );
} 