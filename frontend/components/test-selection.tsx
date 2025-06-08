"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Play, Users, FileText, BarChart3 } from "lucide-react"
import type { AnalysisResult } from "@/app/page"
import { uploadAnalysis } from "@/lib/api"

interface TestSelectionProps {
  data: any[]
  filename: string
  file: File | null
  onAnalysisComplete: (result: AnalysisResult) => void
  onError: (error: string) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const testTypes = [
  { value: "t-test", label: "T-Test (Independent)" },
  { value: "ANOVA", label: "ANOVA (One-way)" },
  { value: "chi-square", label: "Chi-square" },
  { value: "Mann-Whitney U", label: "Mann-Whitney U" },
  { value: "Wilcoxon", label: "Wilcoxon" },
  { value: "Kruskal-Wallis", label: "Kruskal-Wallis" },
]

const confidenceLevels = [
  { value: 90, label: "90%" },
  { value: 95, label: "95%" },
  { value: 99, label: "99%" },
]

export default function TestSelection({
  data,
  filename,
  file,
  onAnalysisComplete,
  onError,
  isLoading,
  setIsLoading,
}: TestSelectionProps) {
  const [selectedTest, setSelectedTest] = useState<string>("")
  const [confidenceLevel, setConfidenceLevel] = useState<number>(95)

  const runAnalysis = async () => {
    if (!selectedTest) {
      onError("Please select a test type")
      return
    }

    setIsLoading(true)

    try {
      if (!data || !data.length) {
        throw new Error("No data to upload")
      }
      if (!filename) {
        throw new Error("No filename provided")
      }
      if (!file) {
        onError("File object is required for upload.")
        setIsLoading(false)
        return
      }
      const confidenceFloat = confidenceLevel / 100
      const result = await uploadAnalysis(file, selectedTest, confidenceFloat)
      onAnalysisComplete(result)
    } catch (error) {
      onError("Failed to run analysis. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getDataSummary = () => {
    const groups = [...new Set(data.map((row) => row.group))]
    const totalRows = data.length
    return { groups, totalRows }
  }

  const { groups, totalRows } = getDataSummary()

  return (
    <div className="space-y-6">
      {/* Data Summary - Improved responsive and dark mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 bg-gradient-to-r from-muted/50 to-muted/30 dark:from-gray-800/50 dark:to-gray-900/30 rounded-xl border border-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm border border-border/30">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">File</Label>
            <p className="text-sm font-semibold truncate" title={filename}>
              {filename}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm border border-border/30">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Rows</Label>
            <p className="text-sm font-semibold">{totalRows.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm border border-border/30">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Groups</Label>
            <p className="text-sm font-semibold truncate" title={groups.join(", ")}>
              {groups.length > 3 ? `${groups.slice(0, 3).join(", ")}...` : groups.join(", ")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm border border-border/30">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</Label>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">Ready</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium mb-3 block">Select Hypothesis Test</Label>
          <Select value={selectedTest} onValueChange={setSelectedTest}>
            <SelectTrigger className="rounded-xl border-border/50">
              <SelectValue placeholder="Choose a statistical test" />
            </SelectTrigger>
            <SelectContent>
              {testTypes.map((test) => (
                <SelectItem key={test.value} value={test.value}>
                  {test.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">Confidence Level</Label>
          <RadioGroup
            value={confidenceLevel.toString()}
            onValueChange={(value) => setConfidenceLevel(Number.parseInt(value))}
            className="flex flex-wrap gap-4 sm:gap-6"
          >
            {confidenceLevels.map((level) => (
              <div key={level.value} className="flex items-center space-x-2">
                <RadioGroupItem value={level.value.toString()} id={`conf-${level.value}`} />
                <Label htmlFor={`conf-${level.value}`} className="font-medium">
                  {level.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button
          onClick={runAnalysis}
          disabled={!selectedTest || isLoading}
          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Analysis...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run Analysis
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
