// components/GymBarChart.tsx
'use client';

import { useEffect, useRef } from 'react';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
      borderRadius?: number;
    }[];
  };
  title?: string;
  type?: 'vertical' | 'horizontal';
  stacked?: boolean;
}

export default function GymBarChart({ 
  data, 
  title = '', 
  type = 'vertical',
  stacked = false 
}: BarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          indexAxis: type === 'horizontal' ? 'y' : 'x',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 12,
                  family: "'Inter', sans-serif"
                },
                usePointStyle: true,
                boxWidth: 8,
                padding: 15
              }
            },
            title: {
              display: !!title,
              text: title,
              font: {
                size: 16,
                weight: 'bold',
                family: "'Inter', sans-serif"
              },
              padding: {
                top: 10,
                bottom: 20
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleFont: {
                size: 13,
                family: "'Inter', sans-serif"
              },
              bodyFont: {
                size: 12,
                family: "'Inter', sans-serif"
              },
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ${context.parsed.y}`;
                }
              }
            }
          },
          scales: {
            x: {
              stacked: stacked,
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 11,
                  family: "'Inter', sans-serif"
                },
                color: '#64748b'
              }
            },
            y: {
              stacked: stacked,
              beginAtZero: true,
              grid: {
                color: '#e2e8f0',
                lineWidth: 1
              },
              ticks: {
                font: {
                  size: 11,
                  family: "'Inter', sans-serif"
                },
                color: '#64748b',
                stepSize: type === 'horizontal' ? undefined : 10,
                callback: function(value) {
                  return value;
                }
              }
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          },
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, title, type, stacked]);

  return (
    <div className="w-full h-96">
      <canvas ref={chartRef}  />
    </div>
  );
}