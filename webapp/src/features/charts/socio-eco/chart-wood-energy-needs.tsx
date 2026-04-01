import type { FC } from "react";

import { useTranslation } from "@shared/i18n";

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type PieChartProps = {
    data: {
        easyToMeet: number;
        moderateToMeet: number;
        difficultToMeet: number;
        dontKnow: number;
    };
};

export const ChartWoodEnergyNeeds: FC<PieChartProps> = ({ data }) => {
    const { t } = useTranslation("translations");
    const chartData = [
        {
            amt: 1400,
            fill: '#8884d8',
            name: '18-24',
            pv: 2400,
            uv: 31.47
        },
        {
            amt: 720,
            fill: '#83a6ed',
            name: '25-29',
            pv: 4567,
            uv: 26.69
        },
        {
            amt: 680,
            fill: '#8dd1e1',
            name: '30-34',
            pv: 1398,
            uv: 15.69
        },
        {
            amt: 1700,
            fill: '#82ca9d',
            name: '35-39',
            pv: 9800,
            uv: 8.22
        },
        {
            amt: 1500,
            fill: '#a4de6c',
            name: '40-49',
            pv: 3908,
            uv: 8.63
        },
        {
            amt: 680,
            fill: '#d0ed57',
            name: '50+',
            pv: 4800,
            uv: 2.63
        },
        {
            amt: 690,
            fill: '#ffc658',
            name: 'unknown',
            pv: 4800,
            uv: 6.67
        }
    ];

    return (
<ResponsiveContainer
  height={400}
  width="100%"
>
  <PieChart
    accessibilityLayer
    barCategoryGap="10%"
    barGap={4}
    cx="50%"
    cy="50%"
    data={chartData}
    endAngle={360}
    innerRadius={0}
    layout="centric"
    margin={{
      bottom: 0,
      left: 0,
      right: 0,
      top: 0
    }}
    outerRadius="80%"
    stackOffset="none"
    startAngle={0}
    syncMethod="index"
  >
    <Pie
      data={chartData}
      dataKey="uv"
    />
    <Tooltip defaultIndex={3} />
  </PieChart>
        </ResponsiveContainer>
    );
};