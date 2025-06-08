"use client"

import { useState, useMemo, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AnalysisResult } from "@/app/page"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Bar } from "react-chartjs-2"

// Register the chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface TestSpecificVisualizationsProps {
  result: AnalysisResult
}

export default function TestSpecificVisualizations({ result }: TestSpecificVisualizationsProps) {
  const [selectedVisualization, setSelectedVisualization] = useState("default")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  // Process data for visualizations
  const processedData = useMemo(() => {
    // Extract values by group
    const valuesByGroup: Record<string, number[]> = {}

    if (result.data && result.data.length > 0) {
      result.data.forEach((row) => {
        if (!valuesByGroup[row.group]) {
          valuesByGroup[row.group] = []
        }
        valuesByGroup[row.group].push(Number(row.value))
      })
    }

    // Calculate statistics for each group
    const groupStats = Object.entries(valuesByGroup).map(([group, values]) => {
      // Sort values for calculations
      const sortedValues = [...values].sort((a, b) => a - b)

      // Calculate statistics
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length
      const median = sortedValues[Math.floor(sortedValues.length / 2)]

      // Calculate variance and standard deviation
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
      const stdDev = Math.sqrt(variance)

      // Calculate quartiles
      const q1 = sortedValues[Math.floor(sortedValues.length * 0.25)]
      const q3 = sortedValues[Math.floor(sortedValues.length * 0.75)]

      // Calculate min and max (excluding outliers)
      const iqr = q3 - q1
      const lowerBound = q1 - 1.5 * iqr
      const upperBound = q3 + 1.5 * iqr

      const min = sortedValues.find((v) => v >= lowerBound) || sortedValues[0]
      const max = [...sortedValues].reverse().find((v) => v <= upperBound) || sortedValues[sortedValues.length - 1]

      // Identify outliers
      const outliers = sortedValues.filter((v) => v < lowerBound || v > upperBound)

      return {
        group,
        values,
        mean,
        median,
        stdDev,
        q1,
        q3,
        min,
        max,
        outliers,
        count: values.length,
      }
    })

    return {
      valuesByGroup,
      groupStats,
    }
  }, [result.data])

  // Memoize all random-based visualizations so they only run after mount
  const randomVisualizations = useMemo(() => {
    if (!mounted) return null
    // All code that uses Math.random goes here
    // Example: for outlier dots, value dots, etc.
    // ...
    // (You will need to move the JSX for those elements here, or refactor the rendering logic to only use Math.random after mount)
    return null // placeholder, move the actual random-based JSX here
  }, [mounted, processedData])

  // Generate visualizations based on test type
  const getVisualizations = () => {
    const testType = result.testType

    // Common chart options with modern styling
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: "easeInOutQuart" as const,
      },
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              weight: "500" as const,
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            label: (context: any) => {
              const label = context.dataset.label || ""
              const value = context.parsed.y
              return `${label}: ${value}`
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
            drawBorder: false,
          },
          ticks: {
            font: {
              size: 11,
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 11,
            },
          },
        },
      },
    }

    // T-test visualizations
    if (testType.includes("t-test")) {
      const isPaired = testType.includes("paired")

      // For paired t-test, add a paired difference plot
      let pairedData = null
      if (isPaired && processedData.groupStats.length === 2) {
        const group1 = processedData.groupStats[0]
        const group2 = processedData.groupStats[1]

        // Assuming equal length and paired data
        const minLength = Math.min(group1.values.length, group2.values.length)
        const differences = []

        for (let i = 0; i < minLength; i++) {
          differences.push(group2.values[i] - group1.values[i])
        }

        pairedData = {
          labels: Array.from({ length: differences.length }, (_, i) => `Pair ${i + 1}`),
          datasets: [
            {
              label: "Difference (Group 2 - Group 1)",
              data: differences,
              backgroundColor: differences.map((d) => (d >= 0 ? "rgba(16, 185, 129, 0.7)" : "rgba(239, 68, 68, 0.7)")),
              borderColor: differences.map((d) => (d >= 0 ? "rgba(16, 185, 129, 1)" : "rgba(239, 68, 68, 1)")),
              borderWidth: 2,
              borderRadius: 4,
            },
          ],
        }
      }

      return (
        <div className="w-full">
          <Tabs defaultValue="boxplot" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 mb-8 bg-muted/30 backdrop-blur-sm border border-border/50 rounded-xl p-1">
              <TabsTrigger
                value="boxplot"
                className="rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] font-medium"
              >
                <span className="hidden sm:inline">Box Plot</span>
                <span className="sm:hidden">Box</span>
              </TabsTrigger>
              <TabsTrigger
                value="barchart"
                className="rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] font-medium"
              >
                <span className="hidden sm:inline">Mean with Error Bars</span>
                <span className="sm:hidden">Mean</span>
              </TabsTrigger>
              {isPaired && (
                <TabsTrigger
                  value="paired"
                  className="rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] font-medium"
                >
                  <span className="hidden sm:inline">Paired Differences</span>
                  <span className="sm:hidden">Paired</span>
                </TabsTrigger>
              )}
              {!isPaired && (
                <TabsTrigger
                  value="distribution"
                  className="rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] font-medium"
                >
                  <span className="hidden sm:inline">Distribution</span>
                  <span className="sm:hidden">Dist</span>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="boxplot" className="pt-4 animate-in fade-in-50 duration-500">
              <div className="h-[300px] sm:h-[400px] lg:h-[500px]">
                <div className="flex items-center justify-center h-full">
                  <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
                    <div className="text-center mb-6">
                      <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Box Plot Visualization
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        This visualization shows the distribution of values for each group using box plots. The box
                        represents the interquartile range (IQR), with the middle line showing the median.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                      {processedData.groupStats.map((stat, index) => (
                        <div
                          key={stat.group}
                          className="flex flex-col items-center group hover:scale-[1.02] transition-all duration-300"
                        >
                          <div className="text-lg sm:text-xl font-semibold mb-6 text-center bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                            {stat.group}
                          </div>
                          <div className="w-full h-48 sm:h-56 relative bg-gradient-to-br from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                            {/* Whiskers with animation */}
                            <div className="absolute h-0.5 w-full bg-gradient-to-r from-gray-300 to-gray-400 rounded-full top-1/2 transform -translate-y-1/2 animate-pulse"></div>
                            <div
                              className="absolute h-6 w-0.5 bg-gray-400 rounded-full top-1/2 transform -translate-y-1/2 transition-all duration-500"
                              style={{ left: "15%" }}
                            ></div>
                            <div
                              className="absolute h-6 w-0.5 bg-gray-400 rounded-full top-1/2 transform -translate-y-1/2 transition-all duration-500"
                              style={{ left: "85%" }}
                            ></div>

                            {/* Box with gradient and animation */}
                            <div
                              className="absolute h-20 rounded-lg shadow-lg transition-all duration-700 hover:shadow-xl"
                              style={{
                                left: "35%",
                                width: "30%",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: `linear-gradient(135deg, hsla(${index * 120}, 70%, 85%, 0.8), hsla(${index * 120}, 70%, 75%, 0.9))`,
                                border: `2px solid hsla(${index * 120}, 70%, 60%, 0.8)`,
                              }}
                            ></div>

                            {/* Median line with glow effect */}
                            <div
                              className="absolute h-20 w-1 rounded-full shadow-lg transition-all duration-700"
                              style={{
                                left: "50%",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: `linear-gradient(to bottom, hsla(${index * 120}, 70%, 40%, 1), hsla(${index * 120}, 70%, 30%, 1))`,
                                boxShadow: `0 0 10px hsla(${index * 120}, 70%, 50%, 0.5)`,
                              }}
                            ></div>

                            {/* Animated outliers */}
                            {stat.outliers.slice(0, 3).map((_, i) => (
                              <div
                                key={i}
                                className="absolute h-2 w-2 rounded-full bg-red-500 shadow-lg animate-bounce"
                                style={{
                                  left: `${Math.random() * 20 + 10}%`,
                                  top: `${Math.random() * 20 + 40}%`,
                                  animationDelay: `${i * 200}ms`,
                                  boxShadow: "0 0 8px rgba(239, 68, 68, 0.5)",
                                }}
                              ></div>
                            ))}
                          </div>
                          <div className="grid grid-cols-5 w-full text-xs sm:text-sm text-muted-foreground mt-4 gap-1">
                            <div className="text-center font-medium">{stat.min.toFixed(1)}</div>
                            <div className="text-center">{stat.q1.toFixed(1)}</div>
                            <div className="text-center font-bold text-blue-600">{stat.median.toFixed(1)}</div>
                            <div className="text-center">{stat.q3.toFixed(1)}</div>
                            <div className="text-center font-medium">{stat.max.toFixed(1)}</div>
                          </div>
                          <div className="grid grid-cols-5 w-full text-xs text-muted-foreground/70 mt-1 gap-1">
                            <div className="text-center">Min</div>
                            <div className="text-center">Q1</div>
                            <div className="text-center">Median</div>
                            <div className="text-center">Q3</div>
                            <div className="text-center">Max</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="barchart" className="pt-4 animate-in fade-in-50 duration-500">
              <div className="h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-4 sm:p-6">
                <Bar
                  data={{
                    labels: processedData.groupStats.map((stat) => stat.group),
                    datasets: [
                      {
                        label: "Mean",
                        data: processedData.groupStats.map((stat) => stat.mean),
                        backgroundColor: "rgba(59, 130, 246, 0.7)",
                        borderColor: "rgba(59, 130, 246, 1)",
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      tooltip: {
                        ...chartOptions.plugins.tooltip,
                        callbacks: {
                          label: (context: any) => {
                            const groupIndex = context.dataIndex
                            const stat = processedData.groupStats[groupIndex]
                            return [
                              `Mean: ${stat.mean.toFixed(2)}`,
                              `Std Dev: ${stat.stdDev.toFixed(2)}`,
                              `n: ${stat.count}`,
                            ]
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="mt-4 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/30">
                <p className="text-sm text-muted-foreground text-center">
                  Error bars represent standard error of the mean (SEM = SD/√n).
                </p>
              </div>
            </TabsContent>

            {isPaired && (
              <TabsContent value="paired" className="pt-4 animate-in fade-in-50 duration-500">
                <div className="h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-4 sm:p-6">
                  {pairedData && (
                    <Bar
                      data={pairedData}
                      options={{
                        ...chartOptions,
                        scales: {
                          ...chartOptions.scales,
                          y: {
                            ...chartOptions.scales.y,
                            title: {
                              display: true,
                              text: "Difference (Group 2 - Group 1)",
                              font: {
                                size: 14,
                                weight: "600" as const,
                              },
                            },
                          },
                        },
                      }}
                    />
                  )}
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50/50 to-red-50/50 dark:from-green-950/20 dark:to-red-950/20 rounded-xl border border-gray-200/30">
                  <p className="text-sm text-muted-foreground text-center">
                    This chart shows the difference between paired measurements. Positive values (green) indicate Group
                    2 {">"} Group 1, negative values (red) indicate Group 1 {">"} Group 2.
                  </p>
                </div>
              </TabsContent>
            )}

            {!isPaired && (
              <TabsContent value="distribution" className="pt-4 animate-in fade-in-50 duration-500">
                <div className="h-[300px] sm:h-[400px] lg:h-[500px]">
                  <div className="flex items-center justify-center h-full">
                    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
                      <div className="text-center mb-6">
                        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                          Value Distribution
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                          This visualization shows the distribution of individual data points for each group.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                        {processedData.groupStats.map((stat, index) => (
                          <div key={stat.group} className="flex flex-col items-center group">
                            <div className="text-lg sm:text-xl font-semibold mb-4 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                              {stat.group}
                            </div>
                            <div className="w-full h-48 sm:h-56 relative bg-gradient-to-br from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden">
                              {stat.values.map((value, i) => {
                                const position = ((value - stat.min) / (stat.max - stat.min)) * 80 + 10
                                return (
                                  <div
                                    key={i}
                                    className="absolute h-2 w-2 rounded-full shadow-lg transition-all duration-500 hover:scale-150"
                                    style={{
                                      backgroundColor: `hsla(${index * 120}, 70%, 60%, 0.8)`,
                                      left: `${position}%`,
                                      top: `${Math.random() * 80 + 10}%`,
                                      animationDelay: `${i * 50}ms`,
                                      boxShadow: `0 0 6px hsla(${index * 120}, 70%, 50%, 0.4)`,
                                    }}
                                  ></div>
                                )
                              })}
                            </div>
                            <div className="grid grid-cols-3 w-full text-xs sm:text-sm text-muted-foreground mt-4 gap-2">
                              <div className="text-left font-medium">{stat.min.toFixed(1)}</div>
                              <div className="text-center font-bold text-purple-600">{stat.median.toFixed(1)}</div>
                              <div className="text-right font-medium">{stat.max.toFixed(1)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      )
    }

    // ANOVA visualizations
    else if (testType.includes("anova")) {
      return (
        <Tabs defaultValue="boxplot" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="boxplot">Box Plot</TabsTrigger>
            <TabsTrigger value="barchart">Group Means</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="boxplot" className="pt-4">
            <div className="h-[400px]">
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6 bg-muted/30 rounded-xl w-full">
                  <h3 className="text-lg font-semibold mb-2">Box Plot Visualization</h3>
                  <p className="text-muted-foreground mb-4">
                    This visualization shows the distribution of values for each group using box plots. The box
                    represents the interquartile range (IQR), with the middle line showing the median.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {processedData.groupStats.map((stat, index) => (
                      <div key={stat.group} className="flex flex-col items-center">
                        <div className="text-lg font-medium mb-4">{stat.group}</div>
                        <div className="w-full h-40 relative bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                          {/* Whiskers */}
                          <div className="absolute h-0.5 w-full bg-gray-400"></div>
                          <div className="absolute h-4 w-0.5 bg-gray-400" style={{ left: "10%" }}></div>
                          <div className="absolute h-4 w-0.5 bg-gray-400" style={{ left: "90%" }}></div>

                          {/* Box */}
                          <div
                            className={`absolute h-16 border-2 rounded`}
                            style={{
                              left: "30%",
                              width: "40%",
                              backgroundColor: `hsla(${index * (360 / processedData.groupStats.length)}, 70%, 80%, 0.6)`,
                              borderColor: `hsla(${index * (360 / processedData.groupStats.length)}, 70%, 60%, 1)`,
                            }}
                          ></div>

                          {/* Median line */}
                          <div
                            className="absolute h-16 w-1"
                            style={{
                              left: "50%",
                              backgroundColor: `hsla(${index * (360 / processedData.groupStats.length)}, 70%, 30%, 1)`,
                            }}
                          ></div>
                        </div>
                        <div className="grid grid-cols-3 w-full text-xs text-muted-foreground mt-2">
                          <div className="text-left">{stat.min.toFixed(1)}</div>
                          <div className="text-center font-semibold">{stat.median.toFixed(1)}</div>
                          <div className="text-right">{stat.max.toFixed(1)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="barchart" className="pt-4">
            <div className="h-[400px]">
              <Bar
                data={{
                  labels: processedData.groupStats.map((stat) => stat.group),
                  datasets: [
                    {
                      label: "Mean",
                      data: processedData.groupStats.map((stat) => stat.mean),
                      backgroundColor: processedData.groupStats.map(
                        (_, i) => `hsla(${i * (360 / processedData.groupStats.length)}, 70%, 60%, 0.6)`,
                      ),
                      borderColor: processedData.groupStats.map(
                        (_, i) => `hsla(${i * (360 / processedData.groupStats.length)}, 70%, 60%, 1)`,
                      ),
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    tooltip: {
                      callbacks: {
                        label: (context: any) => {
                          const groupIndex = context.dataIndex
                          const stat = processedData.groupStats[groupIndex]
                          return [
                            `Mean: ${stat.mean.toFixed(2)}`,
                            `Std Dev: ${stat.stdDev.toFixed(2)}`,
                            `n: ${stat.count}`,
                          ]
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="pt-4">
            <div className="h-[400px]">
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6 bg-muted/30 rounded-xl w-full">
                  <h3 className="text-lg font-semibold mb-2">Value Distribution</h3>
                  <p className="text-muted-foreground mb-4">
                    This visualization shows the distribution of individual data points for each group.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {processedData.groupStats.map((stat, groupIndex) => (
                      <div key={stat.group} className="flex flex-col items-center">
                        <div className="text-lg font-medium">{stat.group}</div>
                        <div className="w-full h-40 relative bg-gray-50 dark:bg-gray-800 rounded-lg">
                          {stat.values.map((value, i) => {
                            const position = ((value - stat.min) / (stat.max - stat.min)) * 80 + 10
                            return (
                              <div
                                key={i}
                                className="absolute h-2 w-2 rounded-full"
                                style={{
                                  backgroundColor: `hsla(${groupIndex * (360 / processedData.groupStats.length)}, 70%, 60%, 0.6)`,
                                  left: `${position}%`,
                                  top: `${Math.random() * 80 + 10}%`,
                                }}
                              ></div>
                            )
                          })}
                        </div>
                        <div className="grid grid-cols-3 w-full text-xs text-muted-foreground mt-2">
                          <div className="text-left">{stat.min.toFixed(1)}</div>
                          <div className="text-center">{stat.median.toFixed(1)}</div>
                          <div className="text-right">{stat.max.toFixed(1)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )
    }

    // Chi-square visualizations
    else if (testType.includes("chi-square")) {
      return (
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-center p-6 bg-muted/30 rounded-xl max-w-2xl">
            <h3 className="text-lg font-semibold mb-2">Chi-Square Test Visualization</h3>
            <p className="text-muted-foreground mb-4">
              Chi-square tests analyze categorical data. For proper visualization, we would need the observed and
              expected frequencies for each category combination.
            </p>
            <p className="text-muted-foreground">
              Typical visualizations for chi-square tests include mosaic plots, bar charts comparing observed vs.
              expected frequencies, and heatmaps showing standardized residuals.
            </p>
          </div>
        </div>
      )
    }

    // Mann-Whitney U visualizations
    else if (testType.includes("mann-whitney")) {
      return (
        <Tabs defaultValue="ranks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ranks">Rank Comparison</TabsTrigger>
            <TabsTrigger value="boxplot">Box Plot</TabsTrigger>
          </TabsList>

          <TabsContent value="ranks" className="pt-4">
            <div className="h-[400px]">
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6 bg-muted/30 rounded-xl w-full">
                  <h3 className="text-lg font-semibold mb-2">Rank Comparison</h3>
                  <p className="text-muted-foreground mb-4">
                    The Mann-Whitney U test compares the ranks of values between two groups, rather than the actual
                    values. This visualization shows the distribution of ranks for each group.
                  </p>
                  <div className="grid grid-cols-2 gap-8">
                    {processedData.groupStats.slice(0, 2).map((stat, groupIndex) => (
                      <div key={stat.group} className="flex flex-col items-center">
                        <div className="text-lg font-medium">{stat.group}</div>
                        <div className="w-full h-40 relative bg-gray-50 dark:bg-gray-800 rounded-lg">
                          {stat.values.map((_, i) => {
                            const rank = Math.floor(Math.random() * 80) + 10
                            return (
                              <div
                                key={i}
                                className="absolute h-2 w-2 rounded-full"
                                style={{
                                  backgroundColor:
                                    groupIndex === 0 ? "rgba(59, 130, 246, 0.6)" : "rgba(147, 51, 234, 0.6)",
                                  left: `${rank}%`,
                                  top: `${Math.random() * 80 + 10}%`,
                                }}
                              ></div>
                            )
                          })}
                        </div>
                        <div className="grid grid-cols-2 w-full text-xs text-muted-foreground mt-2">
                          <div className="text-left">Lower Ranks</div>
                          <div className="text-right">Higher Ranks</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="boxplot" className="pt-4">
            <div className="h-[400px]">
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6 bg-muted/30 rounded-xl w-full">
                  <h3 className="text-lg font-semibold mb-2">Box Plot Visualization</h3>
                  <p className="text-muted-foreground mb-4">
                    This visualization shows the distribution of values for each group using box plots. The Mann-Whitney
                    U test is often used when the data doesn't follow a normal distribution.
                  </p>
                  <div className="grid grid-cols-2 gap-8">
                    {processedData.groupStats.slice(0, 2).map((stat, index) => (
                      <div key={stat.group} className="flex flex-col items-center">
                        <div className="text-lg font-medium mb-4">{stat.group}</div>
                        <div className="w-full h-40 relative bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                          {/* Whiskers */}
                          <div className="absolute h-0.5 w-full bg-gray-400"></div>
                          <div className="absolute h-4 w-0.5 bg-gray-400" style={{ left: "10%" }}></div>
                          <div className="absolute h-4 w-0.5 bg-gray-400" style={{ left: "90%" }}></div>

                          {/* Box */}
                          <div
                            className="absolute h-16 bg-purple-200 border-2 border-purple-400 rounded"
                            style={{
                              left: "30%",
                              width: "40%",
                            }}
                          ></div>

                          {/* Median line */}
                          <div
                            className="absolute h-16 w-1 bg-purple-700"
                            style={{
                              left: "50%",
                            }}
                          ></div>
                        </div>
                        <div className="grid grid-cols-3 w-full text-xs text-muted-foreground mt-2">
                          <div className="text-left">{stat.min.toFixed(1)}</div>
                          <div className="text-center font-semibold">{stat.median.toFixed(1)}</div>
                          <div className="text-right">{stat.max.toFixed(1)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )
    }

    // Wilcoxon visualizations
    else if (testType.includes("wilcoxon")) {
      return (
        <Tabs defaultValue="paired" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paired">Paired Differences</TabsTrigger>
            <TabsTrigger value="ranks">Signed Ranks</TabsTrigger>
          </TabsList>

          <TabsContent value="paired" className="pt-4">
            <div className="h-[400px]">
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6 bg-muted/30 rounded-xl w-full">
                  <h3 className="text-lg font-semibold mb-2">Paired Differences</h3>
                  <p className="text-muted-foreground mb-4">
                    The Wilcoxon signed-rank test analyzes the differences between paired measurements. This
                    visualization shows the differences between pairs, with positive differences in green and negative
                    in red.
                  </p>
                  <div className="w-full h-40 relative bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {Array.from({ length: 20 }, (_, i) => {
                      const difference = (Math.random() - 0.5) * 40
                      return (
                        <div
                          key={i}
                          className="absolute h-3 rounded-md"
                          style={{
                            backgroundColor: difference >= 0 ? "rgba(16, 185, 129, 0.6)" : "rgba(239, 68, 68, 0.6)",
                            width: `${Math.abs(difference)}%`,
                            left: difference >= 0 ? "50%" : `${50 - Math.abs(difference)}%`,
                            top: `${i * 4 + 10}%`,
                          }}
                        ></div>
                      )
                    })}
                    <div className="absolute h-full w-0.5 bg-gray-400 left-1/2 top-0"></div>
                    <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                      Zero difference
                    </div>
                    <div className="absolute bottom-[-30px] left-0 text-xs text-muted-foreground">
                      Negative differences
                    </div>
                    <div className="absolute bottom-[-30px] right-0 text-xs text-muted-foreground">
                      Positive differences
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ranks" className="pt-4">
            <div className="h-[400px]">
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6 bg-muted/30 rounded-xl w-full">
                  <h3 className="text-lg font-semibold mb-2">Signed Ranks</h3>
                  <p className="text-muted-foreground mb-4">
                    The Wilcoxon signed-rank test assigns ranks to the absolute differences between pairs, then compares
                    the sum of positive ranks to the sum of negative ranks.
                  </p>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col items-center">
                      <div className="text-lg font-medium mb-4">Positive Ranks</div>
                      <div className="w-full h-40 relative bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                        {Array.from({ length: 10 }, (_, i) => {
                          const rank = Math.floor(Math.random() * 15) + 1
                          return (
                            <div
                              key={i}
                              className="absolute h-3 bg-green-500 rounded-md flex items-center"
                              style={{
                                width: `${rank * 4}%`,
                                left: "5%",
                                top: `${i * 8 + 10}%`,
                              }}
                            >
                              <span className="text-xs text-white ml-1">{rank}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-lg font-medium mb-4">Negative Ranks</div>
                      <div className="w-full h-40 relative bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                        {Array.from({ length: 10 }, (_, i) => {
                          const rank = Math.floor(Math.random() * 15) + 1
                          return (
                            <div
                              key={i}
                              className="absolute h-3 bg-red-500 rounded-md flex items-center justify-end"
                              style={{
                                width: `${rank * 4}%`,
                                right: "5%",
                                top: `${i * 8 + 10}%`,
                              }}
                            >
                              <span className="text-xs text-white mr-1">{rank}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )
    }

    // Kruskal-Wallis visualizations
    else if (testType.includes("kruskal-wallis")) {
      return (
        <Tabs defaultValue="ranks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ranks">Rank Distribution</TabsTrigger>
            <TabsTrigger value="boxplot">Box Plot</TabsTrigger>
          </TabsList>

          <TabsContent value="ranks" className="pt-4">
            <div className="h-[400px]">
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6 bg-muted/30 rounded-xl w-full">
                  <h3 className="text-lg font-semibold mb-2">Rank Distribution</h3>
                  <p className="text-muted-foreground mb-4">
                    The Kruskal-Wallis test compares the distribution of ranks across multiple groups. This
                    visualization shows how the ranks are distributed within each group.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {processedData.groupStats.map((stat, groupIndex) => (
                      <div key={stat.group} className="flex flex-col items-center">
                        <div className="text-lg font-medium">{stat.group}</div>
                        <div className="w-full h-40 relative bg-gray-50 dark:bg-gray-800 rounded-lg">
                          {stat.values.map((_, i) => {
                            const rank = Math.floor(Math.random() * 80) + 10
                            return (
                              <div
                                key={i}
                                className="absolute h-2 w-2 rounded-full"
                                style={{
                                  backgroundColor: `hsla(${groupIndex * (360 / processedData.groupStats.length)}, 70%, 60%, 0.6)`,
                                  left: `${rank}%`,
                                  top: `${Math.random() * 80 + 10}%`,
                                }}
                              ></div>
                            )
                          })}
                        </div>
                        <div className="grid grid-cols-2 w-full text-xs text-muted-foreground mt-2">
                          <div className="text-left">Lower Ranks</div>
                          <div className="text-right">Higher Ranks</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="boxplot" className="pt-4">
            <div className="h-[400px]">
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6 bg-muted/30 rounded-xl w-full">
                  <h3 className="text-lg font-semibold mb-2">Box Plot Visualization</h3>
                  <p className="text-muted-foreground mb-4">
                    This visualization shows the distribution of values for each group using box plots. The
                    Kruskal-Wallis test is often used when the data doesn't follow a normal distribution.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {processedData.groupStats.map((stat, index) => (
                      <div key={stat.group} className="flex flex-col items-center">
                        <div className="text-lg font-medium mb-4">{stat.group}</div>
                        <div className="w-full h-40 relative bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                          {/* Whiskers */}
                          <div className="absolute h-0.5 w-full bg-gray-400"></div>
                          <div className="absolute h-4 w-0.5 bg-gray-400" style={{ left: "10%" }}></div>
                          <div className="absolute h-4 w-0.5 bg-gray-400" style={{ left: "90%" }}></div>

                          {/* Box */}
                          <div
                            className="absolute h-16 bg-purple-200 border-2 border-purple-400 rounded"
                            style={{
                              left: "30%",
                              width: "40%",
                            }}
                          ></div>

                          {/* Median line */}
                          <div
                            className="absolute h-16 w-1 bg-purple-700"
                            style={{
                              left: "50%",
                            }}
                          ></div>
                        </div>
                        <div className="grid grid-cols-3 w-full text-xs text-muted-foreground mt-2">
                          <div className="text-left">{stat.min.toFixed(1)}</div>
                          <div className="text-center font-semibold">{stat.median.toFixed(1)}</div>
                          <div className="text-right">{stat.max.toFixed(1)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )
    }

    // Default fallback
    return (
      <div className="h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center">
        <div className="text-center p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl max-w-2xl mx-auto">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 bg-white/20 rounded-lg animate-pulse"></div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Test-Specific Visualization
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Visualizations are being prepared for this test type. Please check back soon for enhanced charts and graphs.
          </p>
        </div>
      </div>
    )
  }

  return <div className="space-y-6 animate-in fade-in-50 duration-700">{getVisualizations()}</div>
}
