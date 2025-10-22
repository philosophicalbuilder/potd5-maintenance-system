"use client"

import { useState, useEffect, useMemo } from "react"
import { ArrowLeft, Download, Check, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import BackgroundPaths from "./components/background-paths"
import { Button } from "@/components/ui/button"

interface Plugin {
  id: string
  name: string
  category: string
  description: string
  version: string
  developer: string
  isInstalled: boolean
  isInstalling: boolean
  features: string[]
  compatibility: string[]
}

const plugins: Plugin[] = [
  {
    id: "property-sync",
    name: "Property Sync",
    category: "Integration",
    description: "Real-time synchronization with major property management platforms and MLS systems.",
    version: "v2.1.0",
    developer: "PropTech Solutions",
    isInstalled: false,
    isInstalling: false,
    features: ["MLS Integration", "Real-time Sync", "Multi-platform Support"],
    compatibility: ["Zillow", "Realtor.com", "MLS Systems"],
  },
  {
    id: "advanced-analytics",
    name: "Advanced Analytics",
    category: "Analytics",
    description: "Enhanced property performance analytics with predictive insights and market trends.",
    version: "v3.2.1",
    developer: "Dwello Team",
    isInstalled: true,
    isInstalling: false,
    features: ["Predictive Analytics", "Market Trends", "ROI Forecasting"],
    compatibility: ["All Property Types", "Historical Data", "Market APIs"],
  },
  {
    id: "tenant-portal",
    name: "Tenant Portal",
    category: "Communication",
    description: "Comprehensive tenant communication platform with maintenance requests and payments.",
    version: "v1.8.3",
    developer: "TenantTech Inc",
    isInstalled: false,
    isInstalling: false,
    features: ["Payment Processing", "Maintenance Requests", "Communication Hub"],
    compatibility: ["Mobile App", "Web Portal", "SMS Integration"],
  },
  {
    id: "security-monitor",
    name: "Security Monitor",
    category: "Security",
    description: "Advanced security monitoring and threat detection for your property portfolio.",
    version: "v2.0.1",
    developer: "SecureProps",
    isInstalled: false,
    isInstalling: false,
    features: ["24/7 Monitoring", "Threat Detection", "Alert System"],
    compatibility: ["Security Cameras", "Access Control", "IoT Devices"],
  },
  {
    id: "auto-reports",
    name: "Auto Reports",
    category: "Automation",
    description: "Automated report generation and distribution to stakeholders and investors.",
    version: "v1.5.2",
    developer: "ReportBot Inc",
    isInstalled: false,
    isInstalling: false,
    features: ["Automated Generation", "Custom Templates", "Scheduled Delivery"],
    compatibility: ["Email", "PDF Export", "Dashboard Integration"],
  },
  {
    id: "market-insights",
    name: "Market Insights",
    category: "Analytics",
    description: "Real-time market data and competitive analysis for informed decision making.",
    version: "v2.3.0",
    developer: "MarketPro Analytics",
    isInstalled: false,
    isInstalling: false,
    features: ["Market Comparison", "Competitive Analysis", "Price Optimization"],
    compatibility: ["Market APIs", "Comparative Data", "Regional Analysis"],
  },
  {
    id: "smart-maintenance",
    name: "Smart Maintenance",
    category: "Automation",
    description: "AI-powered maintenance scheduling and vendor management system.",
    version: "v1.9.4",
    developer: "MaintenanceAI",
    isInstalled: false,
    isInstalling: false,
    features: ["Predictive Maintenance", "Vendor Network", "Cost Optimization"],
    compatibility: ["IoT Sensors", "Work Orders", "Vendor APIs"],
  },
  {
    id: "financial-tracker",
    name: "Financial Tracker",
    category: "Analytics",
    description: "Comprehensive financial tracking with expense categorization and tax preparation.",
    version: "v2.7.1",
    developer: "FinProp Solutions",
    isInstalled: false,
    isInstalling: false,
    features: ["Expense Tracking", "Tax Preparation", "Cash Flow Analysis"],
    compatibility: ["Bank APIs", "Accounting Software", "Tax Systems"],
  },
  {
    id: "lease-manager",
    name: "Lease Manager",
    category: "Integration",
    description: "Digital lease management with e-signatures and automated renewals.",
    version: "v3.1.2",
    developer: "LeaseTech Pro",
    isInstalled: false,
    isInstalling: false,
    features: ["E-Signatures", "Auto Renewals", "Document Storage"],
    compatibility: ["DocuSign", "Legal Templates", "Cloud Storage"],
  },
  {
    id: "energy-optimizer",
    name: "Energy Optimizer",
    category: "Automation",
    description: "Smart energy management and utility cost optimization for properties.",
    version: "v1.4.8",
    developer: "GreenTech Properties",
    isInstalled: false,
    isInstalling: false,
    features: ["Energy Monitoring", "Cost Optimization", "Sustainability Reports"],
    compatibility: ["Smart Meters", "Utility APIs", "IoT Devices"],
  },
  {
    id: "virtual-tours",
    name: "Virtual Tours",
    category: "Communication",
    description: "Create immersive 3D virtual tours and property showcases for marketing.",
    version: "v2.2.3",
    developer: "VirtualProp Studios",
    isInstalled: false,
    isInstalling: false,
    features: ["3D Tours", "VR Support", "Marketing Integration"],
    compatibility: ["360° Cameras", "VR Headsets", "Social Media"],
  },
  {
    id: "background-check",
    name: "Background Check",
    category: "Security",
    description: "Comprehensive tenant screening with credit, criminal, and employment verification.",
    version: "v1.6.7",
    developer: "ScreenSafe Inc",
    isInstalled: false,
    isInstalling: false,
    features: ["Credit Checks", "Criminal History", "Employment Verification"],
    compatibility: ["Credit Bureaus", "Court Records", "Employment APIs"],
  },
  {
    id: "insurance-hub",
    name: "Insurance Hub",
    category: "Integration",
    description: "Centralized insurance management with policy tracking and claims processing.",
    version: "v2.0.9",
    developer: "InsureTech Solutions",
    isInstalled: false,
    isInstalling: false,
    features: ["Policy Management", "Claims Processing", "Risk Assessment"],
    compatibility: ["Insurance APIs", "Claims Systems", "Risk Databases"],
  },
  {
    id: "mobile-inspector",
    name: "Mobile Inspector",
    category: "Automation",
    description: "Mobile property inspection app with photo documentation and report generation.",
    version: "v1.7.5",
    developer: "InspectPro Mobile",
    isInstalled: false,
    isInstalling: false,
    features: ["Photo Documentation", "Inspection Reports", "Offline Mode"],
    compatibility: ["Mobile Devices", "Cloud Sync", "Report Templates"],
  },
  {
    id: "rent-optimizer",
    name: "Rent Optimizer",
    category: "Analytics",
    description: "AI-driven rent pricing optimization based on market conditions and property features.",
    version: "v3.0.4",
    developer: "PricingAI Corp",
    isInstalled: false,
    isInstalling: false,
    features: ["Dynamic Pricing", "Market Analysis", "Revenue Optimization"],
    compatibility: ["Market Data", "Pricing Models", "Revenue APIs"],
  },
  {
    id: "emergency-response",
    name: "Emergency Response",
    category: "Security",
    description: "24/7 emergency response system with automated alerts and vendor dispatch.",
    version: "v1.3.6",
    developer: "EmergencyTech",
    isInstalled: false,
    isInstalling: false,
    features: ["24/7 Monitoring", "Auto Dispatch", "Emergency Contacts"],
    compatibility: ["Alert Systems", "Vendor Network", "Communication APIs"],
  },
]

const categories = ["All", "Integration", "Analytics", "Communication", "Security", "Automation"]

export default function PluginsPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [pluginStates, setPluginStates] = useState<Record<string, Plugin>>(
    plugins.reduce((acc, plugin) => ({ ...acc, [plugin.id]: plugin }), {}),
  )
  const [chatMessages, setChatMessages] = useState<Array<{ id: number; type: "user" | "bot"; content: string }>>([
    {
      id: 1,
      type: "bot",
      content: "How may I help?",
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isChatTyping, setIsChatTyping] = useState(false)
  const [highlightedPlugins, setHighlightedPlugins] = useState<string[]>([])

  useEffect(() => {
    setIsLoaded(true)
    // Show chat helper after a delay
    const timer = setTimeout(() => { }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Sort plugins with highlighted ones at the top, but only if they're not installed
  const sortedPlugins = useMemo(() => {
    const filtered = plugins.filter((plugin) => selectedCategory === "All" || plugin.category === selectedCategory)

    return filtered.sort((a, b) => {
      const aHighlighted = highlightedPlugins.includes(a.id)
      const bHighlighted = highlightedPlugins.includes(b.id)
      const aInstalled = pluginStates[a.id]?.isInstalled
      const bInstalled = pluginStates[b.id]?.isInstalled

      // If both are highlighted, prioritize non-installed ones
      if (aHighlighted && bHighlighted) {
        if (aInstalled && !bInstalled) return 1
        if (!aInstalled && bInstalled) return -1
        return 0
      }

      // Highlighted non-installed plugins go to top
      if (aHighlighted && !aInstalled && (!bHighlighted || bInstalled)) return -1
      if (bHighlighted && !bInstalled && (!aHighlighted || aInstalled)) return 1

      return 0
    })
  }, [plugins, selectedCategory, highlightedPlugins, pluginStates])

  const handleInstall = (pluginId: string) => {
    setPluginStates((prev) => ({
      ...prev,
      [pluginId]: { ...prev[pluginId], isInstalling: true },
    }))

    // Simulate installation process
    setTimeout(() => {
      setPluginStates((prev) => ({
        ...prev,
        [pluginId]: {
          ...prev[pluginId],
          isInstalling: false,
          isInstalled: true,
        },
      }))
    }, 2000)
  }

  const handleUninstall = (pluginId: string) => {
    setPluginStates((prev) => ({
      ...prev,
      [pluginId]: { ...prev[pluginId], isInstalling: true },
    }))

    // Simulate uninstallation process
    setTimeout(() => {
      setPluginStates((prev) => ({
        ...prev,
        [pluginId]: {
          ...prev[pluginId],
          isInstalling: false,
          isInstalled: false,
        },
      }))
    }, 2000)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Integration":
        return "rgba(34, 197, 94, 0.2)"
      case "Analytics":
        return "rgba(59, 130, 246, 0.2)"
      case "Communication":
        return "rgba(168, 85, 247, 0.2)"
      case "Security":
        return "rgba(239, 68, 68, 0.2)"
      case "Automation":
        return "rgba(245, 158, 11, 0.2)"
      default:
        return "rgba(71, 85, 105, 0.2)"
    }
  }

  const getCategoryTextColor = (category: string) => {
    switch (category) {
      case "Integration":
        return "text-green-400"
      case "Analytics":
        return "text-blue-400"
      case "Communication":
        return "text-purple-400"
      case "Security":
        return "text-red-400"
      case "Automation":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return

    const userMessage = {
      id: Date.now(),
      type: "user" as const,
      content: chatInput,
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsChatTyping(true)

    // Clear previous highlights
    setHighlightedPlugins([])

    // Simulate AI response
    setTimeout(() => {
      let botResponse = "I can help you find the right plugins for your property management needs."
      let pluginsToHighlight: string[] = []

      const query = chatInput.toLowerCase()

      // Background check queries
      if (query.includes("background check") || query.includes("tenant screening") || query.includes("credit check")) {
        botResponse = "Yes! I found the perfect plugin for background checks, let me show you."
        pluginsToHighlight = ["background-check"]
      }
      // Security-related queries
      else if (query.includes("security") || query.includes("monitoring") || query.includes("safety")) {
        botResponse =
          "I found several security-related plugins for you:\n\n**Security Monitor** - 24/7 monitoring and threat detection\n**Emergency Response** - Automated emergency alerts\n**Background Check** - Tenant screening with criminal history\n\nI've moved these security plugins to the top. Which one interests you most?"
        pluginsToHighlight = ["security-monitor", "emergency-response", "background-check"]
      }
      // Maintenance queries
      else if (query.includes("maintenance") || query.includes("repair") || query.includes("fix")) {
        botResponse =
          "For maintenance management, I recommend:\n\n**Smart Maintenance** - AI-powered maintenance scheduling\n**Mobile Inspector** - Mobile property inspection app\n**Energy Optimizer** - Smart energy management\n\nThese plugins are now at the top to help you manage property maintenance efficiently."
        pluginsToHighlight = ["smart-maintenance", "mobile-inspector", "energy-optimizer"]
      }
      // Analytics queries
      else if (query.includes("analytics") || query.includes("report") || query.includes("data")) {
        botResponse =
          "For analytics and reporting, I recommend:\n\n**Advanced Analytics** - Enhanced property performance analytics (Already installed ✓)\n**Auto Reports** - Automated report generation\n**Financial Tracker** - Comprehensive financial tracking\n**Market Insights** - Real-time market data\n\nI've moved these analytics plugins to the top for you."
        pluginsToHighlight = ["advanced-analytics", "auto-reports", "financial-tracker", "market-insights"]
      }
      // Tenant/Communication queries
      else if (query.includes("tenant") || query.includes("communication") || query.includes("portal")) {
        botResponse =
          "For tenant management and communication:\n\n**Tenant Portal** - Comprehensive tenant communication platform\n**Virtual Tours** - Create immersive 3D virtual tours\n**Lease Manager** - Digital lease management with e-signatures\n\nThese plugins are now at the top to improve your tenant interactions."
        pluginsToHighlight = ["tenant-portal", "virtual-tours", "lease-manager"]
      }
      // Insurance queries
      else if (query.includes("insurance") || query.includes("policy") || query.includes("claims")) {
        botResponse =
          "For insurance management:\n\n**Insurance Hub** by InsureTech Solutions\n• Centralized insurance management\n• Policy tracking and claims processing\n• Risk assessment integration\n\nI've moved this plugin to the top. It will help you manage all your property insurance needs in one place."
        pluginsToHighlight = ["insurance-hub"]
      }
      // Energy/utility queries
      else if (
        query.includes("energy") ||
        query.includes("utility") ||
        query.includes("electric") ||
        query.includes("green")
      ) {
        botResponse =
          "For energy and utility management:\n\n**Energy Optimizer** by GreenTech Properties\n• Smart energy management\n• Utility cost optimization\n• Sustainability reports\n• Integration with smart meters and IoT devices\n\nThis plugin is now at the top and will help you reduce energy costs across your properties."
        pluginsToHighlight = ["energy-optimizer"]
      }
      // Virtual tour queries
      else if (
        query.includes("virtual tour") ||
        query.includes("3d") ||
        query.includes("vr") ||
        query.includes("marketing")
      ) {
        botResponse =
          "For virtual tours and marketing:\n\n**Virtual Tours** by VirtualProp Studios\n• Create immersive 3D virtual tours\n• VR support for enhanced viewing\n• Marketing integration with social media\n• Compatible with 360° cameras\n\nI've moved this plugin to the top to help you showcase your properties effectively."
        pluginsToHighlight = ["virtual-tours"]
      }
      // Financial/accounting queries
      else if (
        query.includes("financial") ||
        query.includes("accounting") ||
        query.includes("tax") ||
        query.includes("expense")
      ) {
        botResponse =
          "For financial management:\n\n**Financial Tracker** by FinProp Solutions\n• Comprehensive financial tracking\n• Expense categorization\n• Tax preparation assistance\n• Cash flow analysis\n• Integration with bank APIs and accounting software\n\nThis plugin is now at the top and will streamline your property finances."
        pluginsToHighlight = ["financial-tracker"]
      }
      // Inspection queries
      else if (query.includes("inspection") || query.includes("inspect") || query.includes("mobile app")) {
        botResponse =
          "For property inspections:\n\n**Mobile Inspector** by InspectPro Mobile\n• Mobile property inspection app\n• Photo documentation\n• Automated report generation\n• Offline mode capability\n\nI've moved this plugin to the top to help you conduct thorough property inspections on the go."
        pluginsToHighlight = ["mobile-inspector"]
      }
      // Rent optimization queries
      else if (query.includes("rent pricing") || query.includes("optimize rent") || query.includes("pricing")) {
        botResponse =
          "For rent optimization:\n\n**Rent Optimizer** by PricingAI Corp\n• AI-driven rent pricing optimization\n• Market condition analysis\n• Revenue optimization\n• Dynamic pricing based on property features\n\nThis plugin is now at the top and will help you maximize rental income."
        pluginsToHighlight = ["rent-optimizer"]
      }
      // General plugin search
      else if (query.includes("plugin for") || query.includes("is there a")) {
        botResponse =
          "I'd be happy to help you find the right plugin! Could you be more specific about what you're looking for? For example:\n\n• Background checks and tenant screening\n• Property maintenance and repairs\n• Financial tracking and reporting\n• Security and monitoring\n• Tenant communication\n• Energy management\n\nJust let me know what functionality you need!"
      }
      // Default response with recommendations
      else {
        botResponse =
          "Based on your property management needs, I'd recommend starting with:\n\n1. **Advanced Analytics** - Already installed ✓\n2. **Property Sync** - For MLS integration\n3. **Tenant Portal** - For better tenant communication\n4. **Smart Maintenance** - For proactive maintenance\n\nI've moved these to the top. Shall I help you install any of these?"
        pluginsToHighlight = ["property-sync", "tenant-portal", "smart-maintenance"]
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: "bot" as const,
        content: botResponse,
      }

      setChatMessages((prev) => [...prev, aiMessage])
      setIsChatTyping(false)

      // Highlight the relevant plugins with a 1.5s delay for background checks
      if (pluginsToHighlight.length > 0) {
        if (
          query.includes("background check") ||
          query.includes("tenant screening") ||
          query.includes("credit check")
        ) {
          // 1.5 second delay before bubbling for background checks
          setTimeout(() => {
            setHighlightedPlugins(pluginsToHighlight)
          }, 1500)
        } else {
          // Immediate bubbling for other queries
          setHighlightedPlugins(pluginsToHighlight)
        }
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden plugins-page-scrollbar">
      {/* Animated Background Paths */}
      <BackgroundPaths />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-8 py-4">
        {/* Page Title */}
        <div>
          <h1 className="text-white text-xl font-light">Plugins</h1>
          <p className="text-gray-400 text-sm font-extralight">Extend Dwello's capabilities</p>
        </div>

        <Link href="/app">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-2xl text-gray-300 hover:text-white transition-all duration-300 cursor-pointer group"
            style={{
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.5) 100%)",
              backdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(71, 85, 105, 0.3)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)",
            }}
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-light">Back to Dwello</span>
          </div>
        </Link>
      </div>

      {/* Main Content with Chat */}
      <div className="relative z-30 px-8 pb-8">
        <div className="flex gap-0">
          {/* Left Column - Plugins (75% width) */}
          <div className="flex-1 pr-6">
            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-light transition-all duration-300 ${selectedCategory === category ? "text-white" : "text-gray-400 hover:text-white"
                      }`}
                    style={{
                      background:
                        selectedCategory === category ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.02)",
                      backdropFilter: "blur(10px) saturate(180%)",
                      border:
                        selectedCategory === category
                          ? "1px solid rgba(59, 130, 246, 0.4)"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: selectedCategory === category ? "0 0 12px rgba(59, 130, 246, 0.3)" : "none",
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Plugins Grid - 3 columns with AnimatePresence for smooth reordering */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {sortedPlugins.map((plugin) => {
                  const currentPlugin = pluginStates[plugin.id]
                  const isHighlighted = highlightedPlugins.includes(plugin.id)
                  const isInstalled = currentPlugin?.isInstalled

                  return (
                    <motion.div
                      key={plugin.id}
                      layout
                      layoutId={plugin.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: isHighlighted && !isInstalled ? 1.02 : 1,
                      }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{
                        layout: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
                        opacity: { duration: 0.3 },
                        scale: { duration: 0.3 },
                      }}
                      className="group"
                    >
                      <div
                        className={`p-6 rounded-2xl border transition-all duration-300 hover:border-white/30 h-full flex flex-col ${isHighlighted && !isInstalled ? "ring-2 ring-blue-400/50" : ""
                          }`}
                        style={{
                          background:
                            isHighlighted && !isInstalled ? "rgba(59, 130, 246, 0.1)" : "rgba(255, 255, 255, 0.02)",
                          backdropFilter: "blur(2px) saturate(120%) brightness(102%) contrast(101%)",
                          WebkitBackdropFilter: "blur(2px) saturate(120%) brightness(102%) contrast(101%)",
                          border:
                            isHighlighted && !isInstalled
                              ? "1px solid rgba(59, 130, 246, 0.3)"
                              : "1px solid rgba(255, 255, 255, 0.03)",
                          boxShadow:
                            isHighlighted && !isInstalled
                              ? "0 0 20px rgba(59, 130, 246, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.1)"
                              : "0 0 0 1px rgba(255, 255, 255, 0.01), 0 0 15px rgba(59, 130, 246, 0.05)",
                          minHeight: "320px",
                        }}
                      >
                        {/* Category Badge */}
                        <div className="mb-3">
                          <span className={`text-xs font-light ${getCategoryTextColor(plugin.category)}`}>
                            {plugin.category}
                          </span>
                        </div>

                        {/* Plugin Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-white text-lg font-light">{plugin.name}</h3>
                            {currentPlugin.isInstalled && (
                              <div className="flex items-center gap-1 text-green-400">
                                <Check className="w-3 h-3" />
                                <span className="text-xs font-light">Installed</span>
                              </div>
                            )}
                          </div>

                          <p className="text-gray-300 text-sm font-light leading-relaxed mb-4">{plugin.description}</p>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-400 font-extralight">Version:</span>
                              <span className="text-white font-light">{plugin.version}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-400 font-extralight">Developer:</span>
                              <span className="text-white font-light">{plugin.developer}</span>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="mb-4">
                            <h4 className="text-gray-400 text-xs font-light mb-2">Key Features:</h4>
                            <div className="flex flex-wrap gap-1">
                              {plugin.features.slice(0, 3).map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 rounded-md text-xs font-extralight"
                                  style={{
                                    background: "rgba(255, 255, 255, 0.05)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    color: "rgba(255, 255, 255, 0.8)",
                                  }}
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Install Button */}
                        <div className="mt-auto">
                          <Button
                            onClick={() => {
                              if (currentPlugin.isInstalled && !currentPlugin.isInstalling) {
                                handleUninstall(plugin.id)
                              } else if (!currentPlugin.isInstalled && !currentPlugin.isInstalling) {
                                handleInstall(plugin.id)
                              }
                            }}
                            disabled={currentPlugin.isInstalling}
                            className="w-full py-2 rounded-xl text-sm font-light transition-all duration-300 relative overflow-hidden group"
                            style={{
                              background: currentPlugin.isInstalled
                                ? currentPlugin.isInstalling
                                  ? "rgba(239, 68, 68, 0.2)"
                                  : "rgba(239, 68, 68, 0.15)"
                                : currentPlugin.isInstalling
                                  ? "rgba(59, 130, 246, 0.2)"
                                  : "rgba(255, 255, 255, 0.02)",
                              backdropFilter: "blur(10px) saturate(180%)",
                              border: currentPlugin.isInstalled
                                ? currentPlugin.isInstalling
                                  ? "1px solid rgba(239, 68, 68, 0.4)"
                                  : "1px solid rgba(239, 68, 68, 0.3)"
                                : currentPlugin.isInstalling
                                  ? "1px solid rgba(59, 130, 246, 0.4)"
                                  : "1px solid rgba(59, 130, 246, 0.2)",
                              boxShadow: currentPlugin.isInstalled
                                ? currentPlugin.isInstalling
                                  ? "0 0 12px rgba(239, 68, 68, 0.3)"
                                  : "0 0 8px rgba(239, 68, 68, 0.2)"
                                : currentPlugin.isInstalling
                                  ? "0 0 12px rgba(59, 130, 246, 0.3)"
                                  : "0 0 8px rgba(59, 130, 246, 0.2)",
                              color: "white",
                            }}
                          >
                            <div className="flex items-center justify-center gap-2">
                              {currentPlugin.isInstalling ? (
                                <>
                                  <div
                                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                    style={{ animation: "spin 1s linear infinite" }}
                                  />
                                  <span>{currentPlugin.isInstalled ? "Uninstalling..." : "Installing..."}</span>
                                </>
                              ) : currentPlugin.isInstalled ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  <span>Uninstall</span>
                                </>
                              ) : (
                                <>
                                  <Download className="w-4 h-4" />
                                  <span>Install</span>
                                </>
                              )}
                            </div>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Column - AI Chat Assistant (25% width, no gap) */}
          <div className="w-80 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="sticky top-8"
            >
              <div
                className="rounded-2xl border h-[650px] flex flex-col"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  backdropFilter: "blur(2px) saturate(120%) brightness(102%) contrast(101%)",
                  WebkitBackdropFilter: "blur(2px) saturate(120%) brightness(102%) contrast(101%)",
                  border: "1px solid rgba(255, 255, 255, 0.03)",
                  boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.01), 0 0 15px rgba(59, 130, 246, 0.05)",
                }}
              >
                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 plugins-page-scrollbar">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.type === "user" ? "justify-end" : "justify-start items-start gap-3"}`}
                    >
                      {msg.type === "bot" && (
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">AI</span>
                          </div>
                        </div>
                      )}
                      <div
                        className="max-w-[85%] px-3 py-2 rounded-2xl"
                        style={{
                          background: msg.type === "user" ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.05)",
                          backdropFilter: "blur(10px) saturate(180%)",
                          border:
                            msg.type === "user"
                              ? "1px solid rgba(59, 130, 246, 0.3)"
                              : "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <p className="text-white text-sm font-light leading-relaxed whitespace-pre-line">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isChatTyping && (
                    <div className="flex justify-start items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">AI</span>
                        </div>
                      </div>
                      <div
                        className="px-3 py-2 rounded-2xl"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          backdropFilter: "blur(10px) saturate(180%)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <div
                            className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                      placeholder="Ask about plugins..."
                      className="flex-1 bg-transparent border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-400/50"
                      style={{
                        backdropFilter: "blur(10px) saturate(180%)",
                      }}
                    />
                    <button
                      onClick={handleSendChatMessage}
                      disabled={!chatInput.trim()}
                      className="px-3 py-2 rounded-xl transition-all duration-200"
                      style={{
                        background: chatInput.trim() ? "rgba(59, 130, 246, 0.3)" : "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        color: chatInput.trim() ? "white" : "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
