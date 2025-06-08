"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { AnalysisResult } from "@/app/page"
import {
  FileText,
  BarChart3,
  Users,
  Calendar,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Edit3,
  Download,
  Share2,
} from "lucide-react"

interface AnalysisSummaryProps {
  result: AnalysisResult
  onEdit?: () => void
}

export default function AnalysisSummary({ result, onEdit }: AnalysisSummaryProps) {
  const getResultIcon = () => {
    const significanceLevel = 1 - result.confidenceLevel / 100
    if (result.pValue < significanceLevel) {
      return <TrendingUp className="h-4 w-4" />
    } else if (result.pValue > 0.5) {
      return <TrendingDown className="h-4 w-4" />
    }
    return <Minus className="h-4 w-4" />
  }

  const getResultColor = () => {
    const significanceLevel = 1 - result.confidenceLevel / 100
    if (result.pValue < significanceLevel) {
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/30"
    } else if (result.pValue > 0.5) {
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30"
    }
    return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/30"
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTestTypeDescription = (testType: string) => {
    const descriptions: Record<string, string> = {
      "t-test-independent": "Compares means between two independent groups",
      "t-test-paired": "Compares means between paired observations",
      anova: "Compares means across multiple groups",
      "chi-square": "Tests independence between categorical variables",
      "mann-whitney": "Non-parametric test for two independent groups",
      wilcoxon: "Non-parametric test for paired samples",
      "kruskal-wallis": "Non-parametric alternative to ANOVA",
    }
    return descriptions[testType] || "Statistical hypothesis test"
  }

  return (
    <Card className="bg-card border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 glass-card sticky top-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            Analysis Summary
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onEdit} className="rounded-lg">
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-lg">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-lg">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>Your statistical analysis results at a glance</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* File Information */}
        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">{result.filename}</p>
            <p className="text-xs text-muted-foreground">
              {result.data?.length || 0} observations • {result.groups?.length || 0} groups
            </p>
          </div>
        </div>

        {/* Test Configuration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Test Type</span>
            <Badge variant="outline" className="rounded-lg">
              {result.testType}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{getTestTypeDescription(result.testType)}</p>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Confidence Level</span>
            <span className="text-sm font-semibold text-blue-600">{result.confidenceLevel}%</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Groups</span>
            <div className="flex gap-1">
              {result.groups?.map((group, index) => (
                <Badge key={index} variant="secondary" className="text-xs rounded-md">
                  {group}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Key Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Result</span>
            <Badge className={`${getResultColor()} rounded-lg px-3 py-1 font-medium`}>
              {getResultIcon()}
              {result.result}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{result.pValue.toFixed(4)}</div>
              <div className="text-xs text-muted-foreground">P-Value</div>
            </div>

            <div className="text-center p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{result.median.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">Median</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Analysis Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Analyzed on {formatDate(result.timestamp)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            <span>Significance level: {(1 - result.confidenceLevel / 100).toFixed(2)} (α)</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Sample size: {result.data?.length || 0}</span>
          </div>
        </div>

        {/* Quick Interpretation */}
        <div className="p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200/30 dark:border-blue-800/30">
          <h4 className="font-medium text-sm mb-2 text-blue-700 dark:text-blue-300">Quick Interpretation</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {result.pValue < 1 - result.confidenceLevel / 100
              ? `The test shows a statistically significant result (p = ${result.pValue.toFixed(4)}), suggesting the observed effect is unlikely due to chance.`
              : `The test does not show a statistically significant result (p = ${result.pValue.toFixed(4)}), suggesting the observed effect could be due to random variation.`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
