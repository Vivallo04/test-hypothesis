"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { AnalysisResult } from "@/app/page"
import { BarChart3, PieChart, TrendingUp, Maximize2, Download, Eye, Grid3X3, Layers } from "lucide-react"
import AnalysisCharts from "./analysis-charts"
import TestSpecificVisualizations from "./test-specific-visualizations"

interface ChartGalleryProps {
  result: AnalysisResult
}

export default function ChartGallery({ result }: ChartGalleryProps) {
  const [selectedChart, setSelectedChart] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "tabs">("tabs")
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const chartCategories = [
    {
      id: "overview",
      label: "Overview Charts",
      icon: BarChart3,
      description: "General statistical visualizations",
      badge: "4 charts",
      color: "from-blue-500 to-cyan-600",
    },
    {
      id: "test-specific",
      label: "Test-Specific",
      icon: TrendingUp,
      description: "Visualizations tailored to your test type",
      badge: "Custom",
      color: "from-purple-500 to-violet-600",
    },
    {
      id: "distribution",
      label: "Distributions",
      icon: PieChart,
      description: "Data distribution analysis",
      badge: "Advanced",
      color: "from-emerald-500 to-teal-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Visualization Gallery
          </h2>
          <p className="text-muted-foreground mt-1">
            Interactive charts and graphs for your {result.testType} analysis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "tabs" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("tabs")}
            className="rounded-lg"
          >
            <Layers className="h-4 w-4 mr-2" />
            Tabs
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="rounded-lg"
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Grid
          </Button>
        </div>
      </div>

      {viewMode === "tabs" ? (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/30 backdrop-blur-sm border border-border/50 rounded-xl p-1 h-auto">
            {chartCategories.map((category) => {
              const Icon = category.icon
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] font-medium"
                >
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{category.label}</div>
                    <div className="text-xs text-muted-foreground hidden sm:block">{category.description}</div>
                    <Badge variant="secondary" className="text-xs mt-1 hidden sm:inline-flex">
                      {category.badge}
                    </Badge>
                  </div>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-card border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  Statistical Overview Charts
                </CardTitle>
                <CardDescription>
                  Comprehensive visualizations showing group comparisons, distributions, and statistical measures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalysisCharts result={result} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test-specific" className="space-y-6">
            <Card className="bg-card border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  {result.testType} Visualizations
                </CardTitle>
                <CardDescription>
                  Specialized charts designed specifically for your chosen statistical test
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TestSpecificVisualizations result={result} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <Card className="bg-card border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <PieChart className="h-4 w-4 text-white" />
                  </div>
                  Distribution Analysis
                </CardTitle>
                <CardDescription>Advanced distribution visualizations and normality assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-[300px] bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border border-emerald-200/30 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <PieChart className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">Q-Q Plot</h3>
                      <p className="text-sm text-muted-foreground">Quantile-quantile plot for normality assessment</p>
                    </div>
                  </div>

                  <div className="h-[300px] bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border border-emerald-200/30 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">Density Plot</h3>
                      <p className="text-sm text-muted-foreground">Kernel density estimation for each group</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overview Charts Card */}
          <Card className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  Overview Charts
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Statistical overview and group comparisons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] overflow-hidden rounded-lg">
                <AnalysisCharts result={result} />
              </div>
            </CardContent>
          </Card>

          {/* Test-Specific Charts Card */}
          <Card className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  Test-Specific
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Visualizations for {result.testType}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] overflow-hidden rounded-lg">
                <TestSpecificVisualizations result={result} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted/30 rounded-xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BarChart3 className="h-4 w-4" />
          <span>All charts are interactive and can be exported</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-lg">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button variant="outline" size="sm" className="rounded-lg">
            <Maximize2 className="h-4 w-4 mr-2" />
            Fullscreen
          </Button>
        </div>
      </div>
    </div>
  )
}
