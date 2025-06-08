"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Database,
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  FileText,
  Calendar,
  Users,
  BarChart3,
} from "lucide-react"

export default function DatasetsPanel() {
  const [searchTerm, setSearchTerm] = useState("")

  const datasets = [
    {
      id: 1,
      name: "Clinical Trial Results",
      description: "Randomized controlled trial data for new medication",
      size: "2.4 MB",
      rows: 1250,
      columns: 8,
      lastModified: "2024-01-15",
      type: "Clinical",
      status: "Active",
    },
    {
      id: 2,
      name: "Survey Responses Q4",
      description: "Customer satisfaction survey data",
      size: "856 KB",
      rows: 890,
      columns: 12,
      lastModified: "2024-01-14",
      type: "Survey",
      status: "Processed",
    },
    {
      id: 3,
      name: "A/B Test Results",
      description: "Website conversion rate experiment",
      size: "1.1 MB",
      rows: 2100,
      columns: 6,
      lastModified: "2024-01-13",
      type: "Experiment",
      status: "Active",
    },
    {
      id: 4,
      name: "Sensor Data Collection",
      description: "IoT sensor readings from manufacturing floor",
      size: "5.2 MB",
      rows: 15000,
      columns: 15,
      lastModified: "2024-01-12",
      type: "IoT",
      status: "Archived",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400"
      case "Processed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400"
      case "Archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-950/20 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Clinical":
        return "from-red-500 to-pink-600"
      case "Survey":
        return "from-blue-500 to-cyan-600"
      case "Experiment":
        return "from-purple-500 to-violet-600"
      case "IoT":
        return "from-green-500 to-emerald-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Dataset Management
          </h1>
          <p className="text-muted-foreground mt-2">Organize and manage your research datasets</p>
        </div>
        <Button className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <Upload className="mr-2 h-4 w-4" />
          Upload Dataset
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="card-gradient border-border/50 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search datasets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl border-border/50"
              />
            </div>
            <Button variant="outline" className="rounded-xl border-border/50">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Datasets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {datasets.map((dataset) => (
          <Card
            key={dataset.id}
            className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTypeColor(dataset.type)} flex items-center justify-center`}
                  >
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {dataset.name}
                    </CardTitle>
                    <CardDescription className="mt-1">{dataset.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(dataset.status)} rounded-lg`}>{dataset.status}</Badge>
                  <Button variant="ghost" size="sm" className="rounded-lg">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{dataset.size}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BarChart3 className="h-4 w-4" />
                  <span>{dataset.rows.toLocaleString()} rows</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{dataset.columns} columns</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{dataset.lastModified}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analyze
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl border-border/50">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border/50 shadow-lg">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">4</div>
            <div className="text-sm text-muted-foreground">Total Datasets</div>
          </CardContent>
        </Card>

        <Card className="card-gradient border-border/50 shadow-lg">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">19.2K</div>
            <div className="text-sm text-muted-foreground">Total Rows</div>
          </CardContent>
        </Card>

        <Card className="card-gradient border-border/50 shadow-lg">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">9.5 MB</div>
            <div className="text-sm text-muted-foreground">Total Size</div>
          </CardContent>
        </Card>

        <Card className="card-gradient border-border/50 shadow-lg">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">2</div>
            <div className="text-sm text-muted-foreground">Active Projects</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
