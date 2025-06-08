"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AnalysisResult } from "@/app/page"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Bar, Line } from "react-chartjs-2"
import { BarChart3 } from "lucide-react"
import { useEffect, useState } from "react"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler)

interface AnalysisChartsProps {
  result: AnalysisResult
}

export default function AnalysisCharts({ result }: AnalysisChartsProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  // Calculate group statistics
  const groupStats =
    result.groups?.map((group) => {
      const groupData = result.data.filter((row) => row.group === group)
      const values = groupData.map((row) => Number.parseFloat(row.value))
      const mean = values.reduce((a, b) => a + b, 0) / values.length
      const median = values.sort((a, b) => a - b)[Math.floor(values.length / 2)]
      return { group, mean, median, count: values.length }
    }) || []

  // Bar chart data
  const barChartData = {
    labels: groupStats.map((stat) => stat.group),
    datasets: [
      {
        label: "Mean",
        data: groupStats.map((stat) => stat.mean),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
      {
        label: "Median",
        data: groupStats.map((stat) => stat.median),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Histogram data
  const allValues = result.data.map((row) => Number.parseFloat(row.value))
  const min = Math.min(...allValues)
  const max = Math.max(...allValues)
  const binCount = 10
  const binWidth = (max - min) / binCount
  const bins = Array.from({ length: binCount }, (_, i) => ({
    start: min + i * binWidth,
    end: min + (i + 1) * binWidth,
    count: 0,
  }))

  allValues.forEach((value) => {
    const binIndex = Math.min(Math.floor((value - min) / binWidth), binCount - 1)
    bins[binIndex].count++
  })

  const histogramData = {
    labels: bins.map((bin) => `${bin.start.toFixed(1)}-${bin.end.toFixed(1)}`),
    datasets: [
      {
        label: "Frequency",
        data: bins.map((bin) => bin.count),
        backgroundColor: "rgba(139, 92, 246, 0.8)",
        borderColor: "rgba(139, 92, 246, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Normal distribution curve (simplified)
  const normalCurveData = {
    labels: Array.from({ length: 100 }, (_, i) => (min + ((max - min) * i) / 99).toFixed(1)),
    datasets: [
      {
        label: "Normal Distribution",
        data: Array.from({ length: 100 }, (_, i) => {
          const x = min + ((max - min) * i) / 99
          const mean = result.median
          const std = result.standardDeviation
          return Math.exp(-0.5 * Math.pow((x - mean) / std, 2)) / (std * Math.sqrt(2 * Math.PI))
        }),
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  }

  // P-value visualization
  const pValueData = {
    labels: Array.from({ length: 100 }, (_, i) => (i / 99).toFixed(2)),
    datasets: [
      {
        label: "P-Value Distribution",
        data: Array.from({ length: 100 }, (_, i) => {
          const x = i / 99
          return x <= result.pValue ? 1 : 0.3
        }),
        backgroundColor: Array.from({ length: 100 }, (_, i) => {
          const x = i / 99
          return x <= result.pValue ? "rgba(239, 68, 68, 0.8)" : "rgba(156, 163, 175, 0.3)"
        }),
        borderColor: "rgba(75, 85, 99, 1)",
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            Group Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={barChartData} options={chartOptions} />
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            Value Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={histogramData} options={chartOptions} />
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            Normal Distribution Curve
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Line
            data={normalCurveData}
            options={{
              ...chartOptions,
              elements: {
                point: {
                  radius: 0,
                },
              },
            }}
          />
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            P-Value Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Bar
            data={pValueData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                tooltip: {
                  callbacks: {
                    title: (context: any) => `P-Value: ${context[0].label}`,
                    label: (context: any) => (context.parsed.y > 0.5 ? "Significant" : "Not Significant"),
                  },
                },
              },
            }}
          />
          <p className="text-sm text-gray-600 mt-2">Red area represents the p-value ({result.pValue.toFixed(4)})</p>
        </CardContent>
      </Card>
    </div>
  )
}
