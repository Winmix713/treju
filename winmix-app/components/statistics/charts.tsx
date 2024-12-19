'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const commonOptions: ChartOptions<'line' | 'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#FFFFFF',
      },
    },
    title: {
      display: true,
      color: '#FFFFFF',
    },
  },
  scales: {
    x: {
      ticks: { color: '#FFFFFF' },
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
    },
    y: {
      ticks: { color: '#FFFFFF' },
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
    },
  },
}

export const LineChart = ({ data }: { data: ChartData<'line'> }) => {
  const options: ChartOptions<'line'> = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales?.y,
        position: 'left',
        title: {
          display: true,
          text: 'Nyerési arány (%)',
          color: '#FFFFFF',
        },
      },
      y1: {
        position: 'right',
        title: {
          display: true,
          text: 'Profit/Veszteség',
          color: '#FFFFFF',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  return <Line options={options} data={data} />
}

export const BarChart = ({ data }: { data: ChartData<'bar'> }) => {
  const options: ChartOptions<'bar'> = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales?.y,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nyerési arány (%)',
          color: '#FFFFFF',
        },
      },
    },
  }

  return <Bar options={options} data={data} />
}

