'use client'; 

import { useEffect, useRef } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      borderWidth?: number;
      pointBackgroundColor?: string;
      pointBorderColor?: string;
      pointRadius?: number;
      pointHoverRadius?: number;
      tension?: number;
    }[];
  };
}

export default function ChartComponent({ data }: ChartProps) {
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
        type: 'line',
        data: data,
        options: {
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
              cornerRadius: 8
            }
          },
          scales: {
            x: {
              grid: {
                display: false,
                drawOnChartArea: false
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
                stepSize: 10,
                callback: function(value) {
                  return value;
                }
              },
              beginAtZero: true
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          },
          elements: {
            line: {
              tension: 0.4,
              borderWidth: 2
            },
            point: {
              radius: 4,
              hoverRadius: 6,
              borderWidth: 2,
              borderColor: '#fff'
            }
          }
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="w-full h-full">
      <canvas ref={chartRef} />
    </div>
  );
}