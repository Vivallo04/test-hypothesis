"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, X, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import TestSelection from "./test-selection"
import type { AnalysisResult } from "@/app/page"

interface CSVUploadProps {
  onDataUpload: (data: any[], filename: string) => void
  onError: (error: string) => void
  onAnalysisComplete: (result: AnalysisResult) => void
}

export default function CSVUpload({ onDataUpload, onError, onAnalysisComplete }: CSVUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [showSetupDialog, setShowSetupDialog] = useState(false)
  const [uploadedData, setUploadedData] = useState<any[]>([])
  const [filename, setFilename] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateCSV = (data: any[]): string | null => {
    if (data.length === 0) {
      return "CSV file is empty"
    }

    const headers = Object.keys(data[0])
    if (!headers.includes("group") || !headers.includes("value")) {
      return "CSV must contain 'group' and 'value' columns"
    }

    // Check if values are numeric
    const hasInvalidValues = data.some((row) => isNaN(Number.parseFloat(row.value)))
    if (hasInvalidValues) {
      return "All values in the 'value' column must be numeric"
    }

    return null
  }

  const parseCSV = (text: string): any[] => {
    const lines = text.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim())

    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim())
      const row: any = {}
      headers.forEach((header, index) => {
        row[header] = values[index]
      })
      return row
    })
  }

  const handleFile = async (file: File) => {
    try {
      setIsLoading(true)
      const text = await file.text()
      const data = parseCSV(text)

      const validationError = validateCSV(data)
      if (validationError) {
        onError(validationError)
        setIsLoading(false)
        return
      }

      setUploadedFile(file)
      setPreviewData(data.slice(0, 5))
      setUploadedData(data)
      setFilename(file.name)
      setUploadSuccess(true)

      // Show success animation then open setup dialog
      setTimeout(() => {
        setShowSetupDialog(true)
        setIsLoading(false)
      }, 1000)

      onDataUpload(data, file.name)
    } catch (error) {
      onError("Failed to parse CSV file. Please check the format.")
      setIsLoading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && files[0].type === "text/csv") {
      handleFile(files[0])
    } else {
      onError("Please upload a CSV file")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const clearFile = () => {
    setUploadedFile(null)
    setPreviewData([])
    setUploadedData([])
    setFilename("")
    setUploadSuccess(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAnalysisCompleteInternal = (result: AnalysisResult) => {
    setShowSetupDialog(false)
    onAnalysisComplete(result)
  }

  return (
    <>
      <div className="space-y-6">
        <div
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-500 ${
            dragActive
              ? "border-blue-400 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.02] shadow-lg"
              : uploadSuccess
                ? "border-green-400 bg-green-50/50 dark:bg-green-950/20"
                : "border-border/50 hover:border-border hover:bg-muted/20"
          } ${isLoading ? "animate-pulse" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div
            className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-500 ${
              uploadSuccess
                ? "bg-gradient-to-br from-green-500 to-emerald-600"
                : isLoading
                  ? "bg-gradient-to-br from-blue-400 to-blue-500 animate-spin"
                  : "bg-gradient-to-br from-blue-500 to-purple-600"
            }`}
          >
            {uploadSuccess ? (
              <CheckCircle2 className="h-8 w-8 text-white animate-bounce" />
            ) : isLoading ? (
              <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-white" />
            )}
          </div>

          <div className="space-y-3">
            {uploadSuccess ? (
              <>
                <p className="text-xl font-semibold text-green-700 dark:text-green-400">File uploaded successfully!</p>
                <p className="text-muted-foreground">Setting up your analysis...</p>
              </>
            ) : isLoading ? (
              <>
                <p className="text-xl font-semibold">Processing your file...</p>
                <p className="text-muted-foreground">Please wait while we validate your data</p>
              </>
            ) : (
              <>
                <p className="text-xl font-semibold">Drop your CSV file here</p>
                <p className="text-muted-foreground">or click to browse your files</p>
                <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-1 inline-block">
                  CSV must contain 'group' and 'value' columns
                </p>
              </>
            )}
          </div>

          <Input ref={fileInputRef} type="file" accept=".csv" onChange={handleInputChange} className="hidden" />

          {!uploadSuccess && !isLoading && (
            <Button
              type="button"
              className="mt-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
          )}
        </div>

        {uploadedFile && !showSetupDialog && (
          <Card className="card-gradient border-border/50 shadow-lg animate-in slide-in-from-bottom-4 duration-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="font-semibold text-lg">{uploadedFile.name}</span>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(1)} KB • {previewData.length}+ rows
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setShowSetupDialog(true)}
                    className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                  >
                    Configure Analysis
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFile}
                    className="rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {previewData.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Data Preview (first 5 rows)</Label>
                  <div className="overflow-x-auto rounded-lg border border-border/50">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          {Object.keys(previewData[0]).map((header) => (
                            <th key={header} className="px-3 py-2 text-left font-medium">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, index) => (
                          <tr key={index} className="border-t border-border/30 hover:bg-muted/20 transition-colors">
                            {Object.values(row).map((value: any, cellIndex) => (
                              <td key={cellIndex} className="px-3 py-2">
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Analysis Setup Dialog */}
      {showSetupDialog && (
        <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Configure Analysis</DialogTitle>
              <DialogDescription>
                Select the statistical test and confidence level for your analysis.
              </DialogDescription>
            </DialogHeader>
            <TestSelection
              data={uploadedData}
              filename={filename}
              file={uploadedFile}
              onAnalysisComplete={handleAnalysisCompleteInternal}
              onError={onError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
