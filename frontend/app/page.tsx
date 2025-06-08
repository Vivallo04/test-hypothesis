"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Sidebar from "@/components/sidebar"
import CSVUpload from "@/components/csv-upload"
import ResultsDisplay from "@/components/results-display"
import HistoryPanel from "@/components/history-panel"
import InsightsPanel from "@/components/insights-panel"
import DatasetsPanel from "@/components/datasets-panel"
import AnalysisSummary from "@/components/analysis-summary"
import ChartGallery from "@/components/chart-gallery"
import { Upload, Sparkles, User, Clock } from "lucide-react"
import { healthCheck } from "../lib/api"

export interface AnalysisResult {
  id: string
  testType: string
  confidenceLevel: number
  median: number
  standardDeviation: number
  pValue: number
  result: string
  timestamp: string
  filename: string
  data: any[]
  groups?: string[]
}

export default function HypothesisTestingApp() {
  const [activeTab, setActiveTab] = useState("analysis")
  const [uploadedData, setUploadedData] = useState<any[]>([])
  const [filename, setFilename] = useState<string>("")
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [userName] = useState("Researcher") // This could come from auth
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'offline' | 'retry'>('checking')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const checkApi = async () => {
    setApiStatus('checking')
    const ok = await healthCheck()
    setApiStatus(ok ? 'connected' : 'offline')
    return ok
  }

  useEffect(() => {
    let isMounted = true
    let timedOut = false
    checkApi()
    timeoutRef.current = setTimeout(() => {
      if (isMounted && apiStatus !== 'connected') {
        setApiStatus('retry')
        timedOut = true
      }
    }, 20000)
    intervalRef.current = setInterval(async () => {
      if (!timedOut) {
        const ok = await healthCheck()
        if (isMounted) setApiStatus(ok ? 'connected' : 'offline')
      }
    }, 5000)
    return () => {
      isMounted = false
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const handleRetry = async () => {
    setApiStatus('checking')
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      if (apiStatus !== 'connected') setApiStatus('retry')
    }, 20000)
    const ok = await healthCheck()
    setApiStatus(ok ? 'connected' : 'offline')
  }

  const handleDataUpload = (data: any[], filename: string) => {
    setUploadedData(data)
    setFilename(filename)
    setError("")
  }

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setIsLoading(false)
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const renderContent = () => {
    const baseClasses = "animate-in fade-in-50 duration-700 slide-in-from-bottom-4"

    switch (activeTab) {
      case "analysis":
        return (
          <div className={`space-y-8 ${baseClasses}`}>
            {/* Personalized Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {getGreeting()}, {userName}!
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Ready to analyze your data with advanced statistical tools
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-2 bg-green-50/50 dark:bg-green-950/20 rounded-xl border border-green-200/30 ${apiStatus === 'connected' ? 'bg-green-500' : apiStatus === 'offline' ? 'bg-red-500' : apiStatus === 'retry' ? 'bg-yellow-400' : 'bg-yellow-400'}`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${apiStatus === 'connected' ? 'bg-green-500' : apiStatus === 'offline' ? 'bg-red-500' : apiStatus === 'retry' ? 'bg-yellow-400' : 'bg-yellow-400'}`}></div>
                  <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                    {apiStatus === 'checking' && 'Checking...'}
                    {apiStatus === 'connected' && 'Connected'}
                    {apiStatus === 'offline' && 'Offline'}
                    {apiStatus === 'retry' && (
                      <button onClick={handleRetry} className="text-yellow-700 underline ml-2">Retry</button>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/30">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {!analysisResult ? (
              /* Upload Section */
              <div className="max-w-4xl mx-auto">
                <Card className="card-gradient border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <CardHeader className="pb-6 text-center">
                    <CardTitle className="flex items-center justify-center gap-3 text-xl sm:text-2xl">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                      Start Your Analysis
                    </CardTitle>
                    <CardDescription className="text-base max-w-2xl mx-auto">
                      Upload your CSV file to begin statistical analysis. Our intelligent system will guide you through
                      the process and recommend the best tests for your data.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CSVUpload
                      onDataUpload={handleDataUpload}
                      onError={handleError}
                      onAnalysisComplete={handleAnalysisComplete}
                    />
                  </CardContent>
                </Card>

                {error && (
                  <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20 mt-6 animate-in slide-in-from-bottom-4 duration-500">
                    <CardContent className="pt-6">
                      <div className="text-red-800 dark:text-red-200">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Analysis Error
                        </h3>
                        <p className="text-sm">{error}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              /* Results Section */
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
                {/* Summary Sidebar */}
                <div className="xl:col-span-1">
                  <AnalysisSummary result={analysisResult} onEdit={() => setAnalysisResult(null)} />
                </div>

                {/* Main Results */}
                <div className="xl:col-span-3 space-y-8">
                  {/* Welcome Back Message */}
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200/30 animate-in slide-in-from-top-4 duration-500">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-green-700 dark:text-green-400">Analysis Complete!</p>
                      <p className="text-sm text-green-600 dark:text-green-500">
                        Your {analysisResult.testType} results are ready for review
                      </p>
                    </div>
                  </div>

                  <div className="animate-in fade-in-50 duration-700 slide-in-from-bottom-4 delay-200">
                    <ResultsDisplay result={analysisResult} />
                  </div>
                  <div className="animate-in fade-in-50 duration-700 slide-in-from-bottom-4 delay-400">
                    <ChartGallery result={analysisResult} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case "upload":
        return (
          <div className={`space-y-8 ${baseClasses}`}>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Data Upload Center
              </h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Import and validate your datasets for statistical analysis
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <Card className="card-gradient border-border/50 shadow-lg">
                <CardContent className="pt-6">
                  <CSVUpload
                    onDataUpload={handleDataUpload}
                    onError={handleError}
                    onAnalysisComplete={handleAnalysisComplete}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "history":
        return (
          <div className={`space-y-8 ${baseClasses}`}>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Analysis History
              </h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Review, rerun, and manage your previous statistical analyses
              </p>
            </div>
            <HistoryPanel onAnalysisSelect={handleAnalysisComplete} />
          </div>
        )

      case "insights":
        return (
          <div className={baseClasses}>
            <InsightsPanel />
          </div>
        )

      case "datasets":
        return (
          <div className={baseClasses}>
            <DatasetsPanel />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">{renderContent()}</div>
      </main>
    </div>
  )
}
