"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { AnalysisResult } from "@/app/page"
import { Play, Trash2, Calendar, FileText, BarChart3 } from "lucide-react"
import { getHistory, rerunAnalysis, deleteAnalysis } from "@/lib/api"

interface HistoryPanelProps {
  onAnalysisSelect: (result: AnalysisResult) => void
}

export default function HistoryPanel({ onAnalysisSelect }: HistoryPanelProps) {
  const [history, setHistory] = useState<AnalysisResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const historyData = await getHistory()
      setHistory(historyData)
    } catch (error) {
      setError("Failed to load analysis history")
    } finally {
      setLoading(false)
    }
  }

  const rerunAnalysisHandler = async (id: string) => {
    try {
      const result = await rerunAnalysis(id)
      onAnalysisSelect(result)
    } catch (error) {
      setError("Failed to rerun analysis")
    }
  }

  const deleteAnalysisHandler = async (id: string) => {
    try {
      await deleteAnalysis(id)
      setHistory((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      setError("Failed to delete analysis")
    }
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

  const getResultBadgeColor = (result: string) => {
    return result.includes("significant") && !result.includes("Not")
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading analysis history...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses yet</h3>
            <p className="text-gray-600">Run your first hypothesis test to see results here.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analysis History</h2>
        <Badge variant="secondary">{history.length} analyses</Badge>
      </div>

      <div className="grid gap-4">
        {history.map((analysis) => (
          <Card
            key={analysis.id}
            className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    {analysis.filename}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(analysis.timestamp)}
                    </span>
                    <span>{analysis.testType}</span>
                    <span>{analysis.confidenceLevel}% confidence</span>
                  </CardDescription>
                </div>
                <Badge className={getResultBadgeColor(analysis.result)}>{analysis.result}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">{analysis.pValue.toFixed(4)}</div>
                  <div className="text-xs text-gray-500">P-Value</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">{analysis.median.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">Median</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-600">{analysis.standardDeviation.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">Std Dev</div>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAnalysisSelect(analysis)}
                  className="flex-1 rounded-xl border-border/50 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20"
                >
                  <Play className="h-3 w-3 mr-1" />
                  View Results
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rerunAnalysisHandler(analysis.id)}
                  className="rounded-xl border-border/50 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/20"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Rerun
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteAnalysisHandler(analysis.id)}
                  className="rounded-xl border-border/50 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
