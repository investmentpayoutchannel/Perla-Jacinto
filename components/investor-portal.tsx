"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Shield, TrendingUp, CheckCircle, Wallet, AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Mail, CreditCard, Download, History, Zap } from "lucide-react"

// ==================== CONFIGURATION SECTION ====================
// Edit these objects to customize the portal with new information

// Main investor profile data
const INVESTOR_CONFIG = {
  fullName: "Perla Jacinto",
  phoneNumber: "09956580967",
  email: "jacintoperla51@gmail.com",
  bank: "Gcash",
  accountName: "Arnel J.",
  accountNumber: "09956580967",
  totalProfit: 38990.0,
  investedAmount: 1000,
  currency: "₱",
  profileImage: "/images/perla-jacinto-profile.jpeg",
  badgeText: "Premium Investor",
}

// Portal settings and timers
const PORTAL_CONFIG = {
  sessionDurationMinutes: 25,
  transactionReferenceNumber: "PH240824389901",
  systemManagementFee: 3990,
  governmentSignatureFee: 3150,
  companyName: "Philippine Payment Portal",
  processingBank: "GCash Philippines",
  withdrawalProcessingDays: "1-3 business days",
}

// Live transaction generator settings
const LIVE_TRANSACTION_CONFIG = {
  maxTransactions: 10,
  generateIntervalSeconds: 18,
  minDelaySeconds: 12,
  maxDelaySeconds: 35,
  minAmount: 75000,
  maxAmount: 350000,
  withdrawalProbability: 0.7,
  initialTransactionCount: 8,
  initialTransactionDelay: 2000,
}

// UI text and messages - easily customizable
const UI_TEXT = {
  portalTitle: "Philippine Payment Portal",
  portalSubtitle: "Real-Time Transaction Processing System",
  urgentActionRequired: "⚠️ URGENT ACTION REQUIRED",
  criticalPaymentOverdue: "🚨 CRITICAL: PAYMENT OVERDUE",
  systemManagementFeeTitle: "System Management Fee Required",
  systemManagementFeeMessage:
    "Your Payout into Your Gcash Account has Been initiated But Pending Into Your Account Due To Uncleared SYSTEM MANAGEMENT of",
  contactManagerTitle: "CONTACT COMPANY MANAGER",
  contactManagerMessage:
    "To meet the transaction deadline and upgrade your recent transaction session, contact the company manager immediately for fee payment processing.",
  immediatePaymentWarning: "⚠️ IMMEDIATE PAYMENT REQUIRED TO PREVENT ACCOUNT SUSPENSION",
  processingMessage: "Payment verification required within",
  expiredMessage: "URGENT: Contact support immediately to avoid account penalties",
}

// Live transaction client pool - add/remove clients here
const CLIENT_POOL = [
  { name: "Maria Santos", banks: ["BPI", "GCash", "BDO"] },
  { name: "Juan Dela Cruz", banks: ["GCash", "UnionBank", "Metrobank"] },
  { name: "Rosa Mendoza", banks: ["BDO", "GCash", "PNB"] },
  { name: "Carlos Reyes", banks: ["UnionBank", "BPI", "GCash"] },
  { name: "Elena Villanueva", banks: ["GCash", "Metrobank", "BDO"] },
  { name: "Miguel Torres", banks: ["Metrobank", "BPI", "UnionBank"] },
  { name: "Carmen Rodriguez", banks: ["GCash", "BDO", "Security Bank"] },
  { name: "Roberto Fernandez", banks: ["BPI", "GCash", "RCBC"] },
  { name: "Isabella Cruz", banks: ["GCash", "UnionBank", "BDO"] },
  { name: "Diego Morales", banks: ["Metrobank", "GCash", "PNB"] },
  { name: "Sofia Gutierrez", banks: ["BDO", "GCash", "BPI"] },
  { name: "Antonio Valdez", banks: ["GCash", "Security Bank", "UnionBank"] },
  { name: "Lucia Herrera", banks: ["BPI", "GCash", "Metrobank"] },
  { name: "Fernando Castro", banks: ["GCash", "BDO", "RCBC"] },
  { name: "Valentina Jimenez", banks: ["UnionBank", "GCash", "PNB"] },
  { name: "Gabriel Ruiz", banks: ["GCash", "BPI", "Security Bank"] },
  { name: "Camila Vargas", banks: ["Metrobank", "GCash", "BDO"] },
  { name: "Sebastian Ortega", banks: ["GCash", "UnionBank", "BPI"] },
  { name: "Natalia Ramos", banks: ["BDO", "GCash", "Metrobank"] },
  { name: "Alejandro Silva", banks: ["GCash", "PNB", "Security Bank"] },
]

// Color and styling configuration
const STYLE_CONFIG = {
  primaryGradient: "from-blue-600 to-indigo-600",
  successGradient: "from-green-50 to-emerald-50",
  warningGradient: "from-orange-100 to-red-100",
  dangerGradient: "from-red-100 to-red-200",
  backgroundGradient: "from-slate-50 via-blue-50 to-indigo-50",
}

// ==================== END CONFIGURATION SECTION ====================

export { InvestorPortal }
export default function InvestorPortal() {
  const [currentPhilippineTime, setCurrentPhilippineTime] = useState(new Date())
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h")
  const [isProcessing, setIsProcessing] = useState(true)
  const [transactionStartTime] = useState(new Date())
  const [liveTransactions, setLiveTransactions] = useState<
    Array<{
      id: number
      name: string
      amount: number
      bank: string
      type: "withdrawal" | "deposit"
      time: Date
      refNumber: string
    }>
  >([])
  const [usedClients, setUsedClients] = useState<Set<string>>(new Set())

  const generateReferenceNumber = () => {
    const prefix = "PH"
    const timestamp = Date.now().toString().slice(-8)
    const random = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0")
    return `${prefix}${timestamp}${random}`
  }

  const generateNewTransaction = () => {
    const availableClients = CLIENT_POOL.filter((client) => !usedClients.has(client.name))

    if (availableClients.length === 0) {
      setUsedClients(new Set())
      return
    }

    const randomClient = availableClients[Math.floor(Math.random() * availableClients.length)]
    const randomBank = randomClient.banks[Math.floor(Math.random() * randomClient.banks.length)]
    const randomAmount = Math.floor(
      Math.random() * (LIVE_TRANSACTION_CONFIG.maxAmount - LIVE_TRANSACTION_CONFIG.minAmount) +
        LIVE_TRANSACTION_CONFIG.minAmount,
    )
    const randomType = Math.random() > LIVE_TRANSACTION_CONFIG.withdrawalProbability ? "deposit" : "withdrawal"

    const uniqueId = Date.now() + Math.floor(Math.random() * 10000)

    const newTransaction = {
      id: uniqueId,
      name: randomClient.name,
      amount: randomAmount,
      bank: randomBank,
      type: randomType as "withdrawal" | "deposit",
      time: new Date(),
      refNumber: generateReferenceNumber(),
    }

    setLiveTransactions((prev) => {
      const updated = [newTransaction, ...prev].slice(0, LIVE_TRANSACTION_CONFIG.maxTransactions)
      return updated
    })

    setUsedClients((prev) => new Set([...prev, randomClient.name]))
  }

  useEffect(() => {
    const generateInitialTransactions = async () => {
      for (let i = 0; i < LIVE_TRANSACTION_CONFIG.initialTransactionCount; i++) {
        setTimeout(
          () => {
            generateNewTransaction()
          },
          i * LIVE_TRANSACTION_CONFIG.initialTransactionDelay + Math.random() * 1000,
        )
      }
    }

    generateInitialTransactions()

    const generateInterval = setInterval(() => {
      const randomDelay =
        Math.random() * (LIVE_TRANSACTION_CONFIG.maxDelaySeconds - LIVE_TRANSACTION_CONFIG.minDelaySeconds) * 1000 +
        LIVE_TRANSACTION_CONFIG.minDelaySeconds * 1000
      setTimeout(generateNewTransaction, randomDelay)
    }, LIVE_TRANSACTION_CONFIG.generateIntervalSeconds * 1000)

    return () => clearInterval(generateInterval)
  }, [])

  useEffect(() => {
    const philippineTimer = setInterval(() => {
      setCurrentPhilippineTime(new Date())
    }, 1000)

    return () => clearInterval(philippineTimer)
  }, [])

  const formatPhilippineTime = (date: Date) => {
    return date.toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  const getTransactionElapsed = (startTime: Date) => {
    const now = new Date()
    const philippineNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }))
    const philippineStartTime = new Date(startTime.toLocaleString("en-US", { timeZone: "Asia/Manila" }))
    const elapsed = Math.floor((philippineNow.getTime() - philippineStartTime.getTime()) / 1000)
    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed % 60

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }

  const getElapsedTime = () => {
    const now = new Date()
    const philippineNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }))
    const philippineStartTime = new Date(transactionStartTime.toLocaleString("en-US", { timeZone: "Asia/Manila" }))
    const elapsed = Math.floor((philippineNow.getTime() - philippineStartTime.getTime()) / 1000)
    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <div className="text-center space-y-3 sm:space-y-4 py-4 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {UI_TEXT.portalTitle}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">{UI_TEXT.portalSubtitle}</p>
              <p className="text-xs sm:text-sm text-slate-500 font-mono">
                🇵🇭 Philippine Time: {formatPhilippineTime(currentPhilippineTime)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-300 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
            >
              <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-pulse" />
              Live Processing Active
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-300 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
            >
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Secure Connection
            </Badge>
            <Badge
              variant="outline"
              className="bg-orange-50 text-orange-700 border-orange-300 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
            >
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Payment Required
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-1 order-1 lg:order-1">
            <Card className="h-fit shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-t-lg p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  Verified Investor Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-4 pb-4">
                  <div className="relative">
                    <img
                      src={INVESTOR_CONFIG.profileImage || "/placeholder.svg"}
                      alt={INVESTOR_CONFIG.fullName}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-2 sm:border-4 border-white flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-base sm:text-lg text-slate-800">{INVESTOR_CONFIG.fullName}</p>
                    <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white mt-2 text-xs sm:text-sm">
                      {INVESTOR_CONFIG.badgeText}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Phone</p>
                      <p className="text-xs sm:text-sm font-medium">{INVESTOR_CONFIG.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Email</p>
                      <p className="text-xs sm:text-sm font-medium break-all">{INVESTOR_CONFIG.email}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2 text-sm sm:text-base">
                    <CreditCard className="h-4 w-4 text-secondary" />
                    Payment Information
                  </h4>

                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Bank</p>
                    <Badge variant="secondary" className="mt-1 text-xs sm:text-sm">
                      {INVESTOR_CONFIG.bank}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Account Name</p>
                    <p className="text-xs sm:text-sm font-medium">{INVESTOR_CONFIG.accountName}</p>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Account Number</p>
                    <p className="text-xs sm:text-sm font-mono font-medium">{INVESTOR_CONFIG.accountNumber}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button
                    className="w-full font-semibold py-2 sm:py-3 shadow-lg text-sm sm:text-base bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                    size="lg"
                  >
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Complete Payment Required
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-2 border-slate-300 hover:bg-slate-50 font-medium py-2 sm:py-3 bg-transparent text-sm sm:text-base"
                    size="lg"
                  >
                    <History className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Transaction History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Card className={`border-0 shadow-xl bg-gradient-to-br ${STYLE_CONFIG.successGradient}`}>
                <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
                  <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    Total Profit Earned
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                    {INVESTOR_CONFIG.currency}
                    {INVESTOR_CONFIG.totalProfit.toLocaleString()}
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                    <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">+6,498% ROI</Badge>
                    <span className="text-xs text-slate-500">from trading activities</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
                  <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    Initial Investment
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                    {INVESTOR_CONFIG.currency}
                    {INVESTOR_CONFIG.investedAmount.toLocaleString()}
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs">Capital Base</Badge>
                    <span className="text-xs text-slate-500">initial deposit</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Profit Summary & Withdrawal</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">Trading performance and payout options</p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-muted rounded-lg border border-green-200 gap-2">
                    <div>
                      <p className="font-medium text-sm sm:text-base">Return on Investment (ROI)</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Based on current profits</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl sm:text-2xl font-bold text-secondary">
                        {((INVESTOR_CONFIG.totalProfit / INVESTOR_CONFIG.investedAmount) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-card rounded-lg border">
                      <p className="text-xs sm:text-sm text-slate-600 mb-1">Net Profit</p>
                      <p className="text-base sm:text-lg font-semibold text-secondary">
                        {INVESTOR_CONFIG.currency}
                        {(INVESTOR_CONFIG.totalProfit - INVESTOR_CONFIG.investedAmount).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-card rounded-lg border">
                      <p className="text-xs sm:text-sm text-slate-600 mb-1">Total Portfolio</p>
                      <p className="text-base sm:text-lg font-semibold text-foreground">
                        {INVESTOR_CONFIG.currency}
                        {(INVESTOR_CONFIG.totalProfit + INVESTOR_CONFIG.investedAmount).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium text-secondary text-sm sm:text-base">Withdrawal Status</h5>
                      <Badge variant="secondary" className="text-xs sm:text-sm">
                        Available
                      </Badge>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                      <p>
                        • Available for withdrawal: {INVESTOR_CONFIG.currency}
                        {INVESTOR_CONFIG.totalProfit.toLocaleString()}
                      </p>
                      <p>• Processing time: {PORTAL_CONFIG.withdrawalProcessingDays}</p>
                      <p>
                        • Withdrawal method: {INVESTOR_CONFIG.bank} ({INVESTOR_CONFIG.accountNumber})
                      </p>
                    </div>
                    <Button className="w-full mt-3 text-xs sm:text-sm" size="sm">
                      <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Initiate Withdrawal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-white rounded-lg shadow-2xl overflow-hidden border-0">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">G</span>
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold">GCash</h2>
                    <p className="text-blue-100 text-sm">Philippine Payment System</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="bg-orange-500 px-6 py-2 rounded-full flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-semibold text-sm">PAYMENT REQUIRED</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <p className="text-gray-600 text-sm mb-2">Withdrawal Amount</p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">₱38,990.00</p>
                  <p className="text-blue-600 font-semibold">Investment Profit Payout</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">📄</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">Transaction Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Recipient</p>
                      <p className="font-semibold text-gray-900">{INVESTOR_CONFIG.fullName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Reference Number</p>
                      <p className="font-semibold text-blue-600">PH240824389901</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Mobile Number</p>
                      <p className="font-semibold text-gray-900">{INVESTOR_CONFIG.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Date & Time</p>
                      <p className="font-semibold text-gray-900">{formatPhilippineTime(currentPhilippineTime)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Transaction Type</p>
                      <p className="font-semibold text-gray-900">Investment Withdrawal</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Processing Bank</p>
                      <p className="font-semibold text-gray-900">GCash Philippines</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-900">Payment Requirements</h3>
                      <p className="text-blue-700 text-sm">Complete these payments to process your withdrawal</p>
                    </div>
                  </div>

                  {/* Payout Processing Notification */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-green-800 text-lg">Payout Processing Active</h4>
                        <p className="text-green-700 text-sm">
                          Your ₱38,990 withdrawal is currently being processed to your GCash account
                        </p>
                        <p className="text-green-600 text-xs mt-1">
                          • Processing initiated at {formatPhilippineTime(transactionStartTime)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-700 text-sm font-medium">PROCESSING</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* System Management Fee - PAID */}
                    <div className="bg-white border-2 border-green-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-green-800 text-lg">System Management Fee</h4>
                            <p className="text-green-600 text-sm">✓ Payment completed and verified</p>
                            <p className="text-gray-500 text-xs mt-1">BSP compliance and system processing</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-800">
                            ₱{PORTAL_CONFIG.systemManagementFee.toLocaleString()}
                          </p>
                          <Badge className="bg-green-500 text-white font-semibold">COMPLETED</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Government Signature Fee - REQUIRED */}
                    <div className="bg-white border-2 border-amber-300 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                          <div>
                            <h4 className="font-bold text-amber-800 text-lg">Government Approved Signature Fee</h4>
                            <p className="text-amber-700 text-sm font-semibold">⏳ Awaiting deposit confirmation</p>
                            <p className="text-gray-500 text-xs mt-1">
                              Document authentication & BSP regulatory compliance
                            </p>
                            <p className="text-amber-600 text-xs mt-1 font-medium">
                              System is waiting for your deposit to complete transaction processing
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-amber-800">
                            ₱{PORTAL_CONFIG.governmentSignatureFee.toLocaleString()}
                          </p>
                          <Badge className="bg-amber-500 text-white font-semibold">WAITING</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Payment Summary */}
                  <div className="mt-6 bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-slate-300 rounded-xl p-6 shadow-lg">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full mb-3">
                        <AlertCircle className="h-4 w-4 text-slate-600" />
                        <span className="text-slate-700 font-semibold text-sm">TRANSACTION COMPLETION REQUIRED</span>
                      </div>
                      <h4 className="text-xl font-bold text-slate-800 mb-2">Outstanding Balance</h4>
                      <p className="text-slate-600 text-sm mb-4">
                        Final payment required to complete your withdrawal transaction
                      </p>
                    </div>

                    <div className="bg-white border-2 border-slate-200 rounded-lg p-6 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-slate-500 text-sm">Amount Due</p>
                          <p className="text-3xl font-bold text-slate-800">
                            ₱{PORTAL_CONFIG.governmentSignatureFee.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-500 text-sm">Transaction Status</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                            <span className="text-amber-700 font-semibold text-sm">PENDING DEPOSIT</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500 mb-1">Payout Amount</p>
                            <p className="font-bold text-green-700">₱38,990.00</p>
                          </div>
                          <div>
                            <p className="text-slate-500 mb-1">Processing Status</p>
                            <p className="font-bold text-blue-700">ACTIVE</p>
                          </div>
                          <div>
                            <p className="text-slate-500 mb-1">Completion Fee</p>
                            <p className="font-bold text-amber-700">
                              ₱{PORTAL_CONFIG.governmentSignatureFee.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 mb-1">Expected Release</p>
                            <p className="font-bold text-slate-700">Upon Payment</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <h5 className="font-bold text-lg">Important Notice</h5>
                      </div>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        Your withdrawal of <strong>₱38,990</strong> is currently being processed to your GCash account.
                        To complete this transaction and release the funds, the Government Approved Signature Fee of
                        <strong> ₱{PORTAL_CONFIG.governmentSignatureFee.toLocaleString()}</strong> must be settled. This
                        is a mandatory BSP compliance requirement for all high-value transactions.
                      </p>
                    </div>

                    <div className="text-center">
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-4 text-lg shadow-lg">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Complete Transaction Payment
                      </Button>
                      <p className="text-slate-500 text-xs mt-2">
                        Secure payment processing • SSL encrypted • BSP regulated
                      </p>
                    </div>
                  </div>

                  {/* Security badges */}
                  <div className="flex flex-wrap justify-center gap-3 mt-6 pt-4 border-t border-blue-200">
                    <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full border border-green-200">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-green-700 text-sm font-medium">BSP Regulated</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full border border-blue-200">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-700 text-sm font-medium">SSL Secured</span>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-full border border-purple-200">
                      <Zap className="h-4 w-4 text-purple-600" />
                      <span className="text-purple-700 text-sm font-medium">Real-time Processing</span>
                    </div>
                  </div>
                </div>

                <div className="text-center border-t pt-4">
                  <p className="font-semibold text-gray-900 mb-1">Official Philippine Payment Processing System</p>
                  <p className="text-gray-500 text-sm">Transaction ID: PH240824389901 • Powered by GCash Philippines</p>
                  <p className="text-gray-400 text-xs mt-2">© 2025 Philippine Payment Portal • All rights reserved</p>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-100 to-blue-100">
              <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                  Current Session Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-3 sm:p-4 bg-white rounded-lg border">
                    <p className="text-xs sm:text-sm text-slate-600 mb-1">Session Duration</p>
                    <p className="text-lg sm:text-xl font-bold text-slate-800">{getElapsedTime()}</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-white rounded-lg border">
                    <p className="text-xs sm:text-sm text-slate-600 mb-1">Status</p>
                    <Badge className="text-xs sm:text-sm bg-orange-500">ACTIVE</Badge>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-white rounded-lg border">
                    <p className="text-xs sm:text-sm text-slate-600 mb-1">Next Action</p>
                    <p className="text-xs sm:text-sm font-semibold text-red-600">Complete Payment</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
