"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, BarChart3, PieChart, Target, Zap, Brain, Lightbulb } from "lucide-react"

export default function InsightsPanel() {
  const insights = [
    {
      title: "Statistical Power Analysis",
      description: "Your recent t-test showed high statistical power (0.89)",
      icon: Target,
      color: "from-green-500 to-emerald-600",
      progress: 89,
      trend: "up",
    },
    {
      title: "Effect Size Interpretation",
      description: "Medium effect size detected (Cohen's d = 0.6)",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-600",
      progress: 60,
      trend: "up",
    },
    {
      title: "Sample Size Recommendation",
      description: "Consider n=120 for 95% power in future studies",
      icon: Brain,
      color: "from-purple-500 to-violet-600",
      progress: 75,
      trend: "neutral",
    },
    {
      title: "Data Quality Score",
      description: "Excellent data quality with minimal outliers",
      icon: Zap,
      color: "from-orange-500 to-red-600",
      progress: 94,
      trend: "up",
    },
  ]

  const recommendations = [
    {
      title: "Consider Non-parametric Tests",
      description: "Your data shows slight skewness. Mann-Whitney U might be more appropriate.",
      priority: "High",
      icon: Lightbulb,
    },
    {
      title: "Increase Sample Size",
      description: "For more robust results, consider collecting 50 more observations.",
      priority: "Medium",
      icon: TrendingUp,
    },
    {
      title: "Check for Outliers",
      description: "2 potential outliers detected in the treatment group.",
      priority: "Low",
      icon: Target,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Statistical Insights
        </h1>
        <p className="text-muted-foreground mt-2">AI-powered recommendations and insights from your analyses</p>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon
          return (
            <Card
              key={index}
              className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${insight.color} flex items-center justify-center`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">{insight.title}</span>
                      {insight.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {insight.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{insight.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Confidence</span>
                    <span className="font-medium">{insight.progress}%</span>
                  </div>
                  <Progress value={insight.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recommendations */}
      <Card className="card-gradient border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            AI Recommendations
          </CardTitle>
          <CardDescription>Personalized suggestions to improve your statistical analyses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => {
              const Icon = rec.icon
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{rec.title}</h4>
                      <Badge
                        variant={
                          rec.priority === "High" ? "destructive" : rec.priority === "Medium" ? "default" : "secondary"
                        }
                        className="rounded-lg"
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="card-gradient border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks based on your recent activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <PieChart className="h-5 w-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Power Analysis</span>
              </div>
            </Button>
            <Button variant="outline" className="h-16 rounded-xl border-border/50 hover:bg-muted/50">
              <div className="text-center">
                <BarChart3 className="h-5 w-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Effect Size Calculator</span>
              </div>
            </Button>
            <Button variant="outline" className="h-16 rounded-xl border-border/50 hover:bg-muted/50">
              <div className="text-center">
                <Target className="h-5 w-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Sample Size Planner</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
