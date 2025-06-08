"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  BarChart3,
  Upload,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Zap,
  TrendingUp,
  Database,
  Menu,
  X,
} from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  className?: string
}

export default function Sidebar({ activeTab, onTabChange, className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { theme, setTheme } = useTheme()

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setCollapsed(false) // Always expanded on mobile when open
        setMobileOpen(false) // Close mobile menu by default
      } else {
        // On desktop, maintain collapsed state but ensure it's not too narrow
        if (collapsed && window.innerWidth < 1200) {
          setCollapsed(false)
        }
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [collapsed])

  // Close mobile menu when tab changes
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false)
    }
  }, [activeTab, isMobile])

  const navigation = [
    {
      id: "analysis",
      label: "Analysis",
      icon: BarChart3,
      description: "Run statistical tests",
      badge: "New",
      shortLabel: "Analysis",
    },
    {
      id: "upload",
      label: "Data Upload",
      icon: Upload,
      description: "Import CSV files",
      shortLabel: "Upload",
    },
    {
      id: "history",
      label: "History",
      icon: History,
      description: "Previous analyses",
      shortLabel: "History",
    },
    {
      id: "insights",
      label: "Insights",
      icon: TrendingUp,
      description: "Data insights",
      badge: "Pro",
      shortLabel: "Insights",
    },
    {
      id: "datasets",
      label: "Datasets",
      icon: Database,
      description: "Manage data",
      shortLabel: "Data",
    },
  ]

  const handleTabChange = (tab: string) => {
    onTabChange(tab)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const handleCollapse = () => {
    if (!isMobile) {
      setCollapsed(!collapsed)
    }
  }

  // Mobile overlay
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-50 lg:hidden h-10 w-10 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Mobile Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl transform transition-transform duration-300 ease-out">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        StatSuite
                      </h1>
                      <p className="text-xs text-muted-foreground">Statistical Analysis</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileOpen(false)}
                    className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Navigation */}
                <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id

                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start h-14 rounded-xl transition-all duration-300 group",
                          isActive &&
                            "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/30 dark:border-blue-800/30 shadow-lg",
                          !isActive && "hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:scale-[1.02]",
                        )}
                        onClick={() => handleTabChange(item.id)}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 transition-colors mr-3",
                            isActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground",
                          )}
                        />
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <span
                              className={cn(
                                "font-medium text-sm",
                                isActive ? "text-blue-600 dark:text-blue-400" : "text-foreground",
                              )}
                            >
                              {item.label}
                            </span>
                            {item.badge && (
                              <Badge
                                variant={item.badge === "Pro" ? "default" : "secondary"}
                                className="text-xs h-5 px-2 ml-2"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                        </div>
                      </Button>
                    )
                  })}
                </div>

                <Separator className="mx-4" />

                {/* Settings & Theme Toggle */}
                <div className="p-4 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-12 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5 text-muted-foreground mr-3" />
                    ) : (
                      <Moon className="h-5 w-5 text-muted-foreground mr-3" />
                    )}
                    <span className="text-sm font-medium">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start h-12 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                  >
                    <Settings className="h-5 w-5 text-muted-foreground mr-3" />
                    <span className="text-sm font-medium">Settings</span>
                  </Button>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Version 2.0.1</p>
                    <p className="text-xs text-muted-foreground mt-1">Built with ❤️ for researchers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Desktop sidebar
  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl",
        collapsed ? "w-20" : "w-72",
        "transition-all duration-500 ease-in-out",
        className,
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  StatSuite
                </h1>
                <p className="text-xs text-muted-foreground">Statistical Analysis</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCollapse}
            className="h-8 w-8 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item, index) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <div key={item.id} className="relative">
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-12 rounded-xl transition-all duration-300 group relative",
                  collapsed ? "px-3" : "px-4",
                  isActive &&
                    "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/30 dark:border-blue-800/30 shadow-lg scale-[1.02]",
                  !isActive && "hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:scale-[1.02]",
                )}
                onClick={() => onTabChange(item.id)}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all duration-300 flex-shrink-0",
                    isActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground",
                    collapsed ? "mx-auto" : "mr-3",
                  )}
                />
                {!collapsed && (
                  <div className="flex-1 text-left animate-fade-in min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "font-medium text-sm transition-colors duration-300 truncate",
                          isActive ? "text-blue-600 dark:text-blue-400" : "text-foreground",
                        )}
                      >
                        {item.label}
                      </span>
                      {item.badge && (
                        <Badge
                          variant={item.badge === "Pro" ? "default" : "secondary"}
                          className="text-xs h-5 px-2 animate-scale-in flex-shrink-0 ml-2"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 transition-opacity duration-300 truncate">
                      {item.description}
                    </p>
                  </div>
                )}
              </Button>

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 top-1/2 transform -translate-y-1/2 shadow-lg">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                  {/* Arrow */}
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-100"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Separator className="mx-4" />

      {/* Settings & Theme Toggle */}
      <div className="p-4 space-y-2">
        <div className="relative">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-12 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-[1.02] group",
              collapsed ? "px-3" : "px-4",
            )}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun
                className={cn(
                  "h-5 w-5 text-muted-foreground transition-colors duration-300 flex-shrink-0",
                  collapsed ? "mx-auto" : "mr-3",
                )}
              />
            ) : (
              <Moon
                className={cn(
                  "h-5 w-5 text-muted-foreground transition-colors duration-300 flex-shrink-0",
                  collapsed ? "mx-auto" : "mr-3",
                )}
              />
            )}
            {!collapsed && (
              <span className="text-sm font-medium animate-fade-in">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </Button>

          {/* Tooltip for collapsed state */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 top-1/2 transform -translate-y-1/2 shadow-lg">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
              {/* Arrow */}
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-100"></div>
            </div>
          )}
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-12 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-[1.02] group",
              collapsed ? "px-3" : "px-4",
            )}
          >
            <Settings
              className={cn(
                "h-5 w-5 text-muted-foreground transition-colors duration-300 flex-shrink-0",
                collapsed ? "mx-auto" : "mr-3",
              )}
            />
            {!collapsed && <span className="text-sm font-medium animate-fade-in">Settings</span>}
          </Button>

          {/* Tooltip for collapsed state */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 top-1/2 transform -translate-y-1/2 shadow-lg">
              Settings
              {/* Arrow */}
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-100"></div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Version 2.0.1</p>
            <p className="text-xs text-muted-foreground mt-1">Built with ❤️ for researchers</p>
          </div>
        </div>
      )}
    </div>
  )
}
