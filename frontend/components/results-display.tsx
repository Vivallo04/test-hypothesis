"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AnalysisResult } from "@/app/page"
import { TrendingUp, TrendingDown, Minus, Sparkles, BookOpen, BarChart3, Info } from "lucide-react"
import AnalysisCharts from "./analysis-charts"
import TestSpecificVisualizations from "./test-specific-visualizations"
import ResultsInterpretation from "./results-interpretation"

interface ResultsDisplayProps {
  result: AnalysisResult
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const getResultIcon = () => {
    if (result.pValue < 1 - result.confidenceLevel / 100) {
      return <TrendingUp className="h-4 w-4" />
    } else if (result.pValue > 0.5) {
      return <TrendingDown className="h-4 w-4" />
    }
    return <Minus className="h-4 w-4" />
  }

  const getResultColor = () => {
    if (result.pValue < 1 - result.confidenceLevel / 100) {
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/30"
    } else if (result.pValue > 0.5) {
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30"
    }
    return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/30"
  }

  const significanceLevel = 1 - result.confidenceLevel / 100

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              Analysis Results
            </div>
            <Badge variant="outline" className={`${getResultColor()} rounded-xl px-3 py-1 font-medium`}>
              {getResultIcon()}
              {result.result}
            </Badge>
          </CardTitle>
          <CardDescription className="flex items-center gap-2 text-base">
            <span className="font-medium">{result.testType}</span>
            <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
            <span>{result.confidenceLevel}% confidence</span>
            <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
            <span className="text-blue-600 dark:text-blue-400">{result.filename}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-50/80 to-blue-100/80 dark:from-blue-950/30 dark:to-blue-900/30 rounded-xl sm:rounded-2xl border border-blue-200/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover-lift">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{result.pValue.toFixed(4)}</div>
              <div className="text-sm text-muted-foreground mt-1">P-Value</div>
            </div>
            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-50/80 to-blue-100/80 dark:from-blue-950/30 dark:to-blue-900/30 rounded-xl sm:rounded-2xl border border-blue-200/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover-lift">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {result.median.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Median</div>
            </div>
            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-50/80 to-blue-100/80 dark:from-blue-950/30 dark:to-blue-900/30 rounded-xl sm:rounded-2xl border border-blue-200/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover-lift">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {result.standardDeviation.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Std Dev</div>
            </div>
            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-50/80 to-blue-100/80 dark:from-blue-950/30 dark:to-blue-900/30 rounded-xl sm:rounded-2xl border border-blue-200/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover-lift">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{result.confidenceLevel}%</div>
              <div className="text-sm text-muted-foreground mt-1">Confidence</div>
            </div>
          </div>

          <Separator className="my-6" />

          <Tabs defaultValue="interpretation" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 mb-6 bg-muted/30 backdrop-blur-sm border border-border/50 rounded-xl p-1">
              <TabsTrigger
                value="interpretation"
                className="flex items-center gap-2 rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] font-medium btn-modern"
              >
                <BookOpen className="h-4 w-4" />
                Interpretation
              </TabsTrigger>
              <TabsTrigger
                value="visualizations"
                className="flex items-center gap-2 rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] font-medium btn-modern"
              >
                <BarChart3 className="h-4 w-4" />
                Visualizations
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="flex items-center gap-2 rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] font-medium btn-modern"
              >
                <Info className="h-4 w-4" />
                Test Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="interpretation" className="space-y-4">
              <ResultsInterpretation result={result} />
            </TabsContent>

            <TabsContent value="visualizations">
              <TestSpecificVisualizations result={result} />
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-xl">
                  <h4 className="font-semibold mb-2">Test Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Test Type:</span>
                      <p className="font-medium">{result.testType}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Confidence Level:</span>
                      <p className="font-medium">{result.confidenceLevel}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Significance Level (α):</span>
                      <p className="font-medium">{significanceLevel.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">P-Value:</span>
                      <p className="font-medium">{result.pValue.toFixed(4)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Groups:</span>
                      <p className="font-medium">{result.groups?.join(", ")}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sample Size:</span>
                      <p className="font-medium">{result.data?.length || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-xl">
                  <h4 className="font-semibold mb-2">Statistical Decision</h4>
                  <p className="text-sm">
                    {result.pValue < significanceLevel
                      ? `With a p-value of ${result.pValue.toFixed(4)} (less than the significance level of ${significanceLevel.toFixed(2)}), we reject the null hypothesis.`
                      : `With a p-value of ${result.pValue.toFixed(4)} (greater than the significance level of ${significanceLevel.toFixed(2)}), we fail to reject the null hypothesis.`}
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-xl">
                  <h4 className="font-semibold mb-2">Assumptions</h4>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {result.testType.includes("t-test") && (
                      <>
                        <li>Data follows a normal distribution</li>
                        <li>Equal variances between groups (for independent t-test)</li>
                        <li>Independent observations (for independent t-test)</li>
                        <li>Paired observations (for paired t-test)</li>
                      </>
                    )}
                    {result.testType.includes("anova") && (
                      <>
                        <li>Data follows a normal distribution</li>
                        <li>Equal variances across groups</li>
                        <li>Independent observations</li>
                      </>
                    )}
                    {result.testType.includes("chi-square") && (
                      <>
                        <li>Independent observations</li>
                        <li>Expected frequencies greater than 5 in each cell</li>
                      </>
                    )}
                    {result.testType.includes("mann-whitney") && (
                      <>
                        <li>Independent observations</li>
                        <li>Similar distribution shapes between groups</li>
                      </>
                    )}
                    {result.testType.includes("wilcoxon") && (
                      <>
                        <li>Paired observations</li>
                        <li>Symmetric distribution of differences</li>
                      </>
                    )}
                    {result.testType.includes("kruskal-wallis") && (
                      <>
                        <li>Independent observations</li>
                        <li>Similar distribution shapes across groups</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AnalysisCharts result={result} />
    </div>
  )
}
