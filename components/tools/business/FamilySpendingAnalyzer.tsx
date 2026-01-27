"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Plus, Trash2, Download, FileJson, FileText, DollarSign, PieChart, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Settings, AlertCircle, CheckCircle2, Upload, RefreshCw, Users, PiggyBank, Target, LineChart } from "lucide-react"
import { jsPDF } from "jspdf"
import { motion, AnimatePresence } from "framer-motion"

interface Expense {
    id: string
    name: string
    category: string
    amount: number
    date: string
    isRecurring: boolean
}

interface SavingsGoal {
    id: string
    name: string
    target: number
    current: number
}

const CATEGORIES = [
    "Housing",
    "Food",
    "Transportation",
    "Utilities",
    "Insurance",
    "Healthcare",
    "Saving",
    "Personal",
    "Entertainment",
    "Miscellaneous",
]

const CURRENCIES = [
    { code: "USD", symbol: "$", locale: "en-US" },
    { code: "EUR", symbol: "€", locale: "de-DE" },
    { code: "GBP", symbol: "£", locale: "en-GB" },
    { code: "INR", symbol: "₹", locale: "en-IN" },
    { code: "JPY", symbol: "¥", locale: "ja-JP" },
    { code: "CAD", symbol: "C$", locale: "en-CA" },
    { code: "AUD", symbol: "A$", locale: "en-AU" },
]

export default function FamilySpendingAnalyzer() {
    const [isLoaded, setIsLoaded] = useState(false)
    const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'tools' | 'settings'>('dashboard')

    // Settings & Data
    const [currency, setCurrency] = useState(CURRENCIES[0])
    const [income, setIncome] = useState<number>(0)
    const [budget, setBudget] = useState<number>(0) // Total Monthly Budget
    const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>({})
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])

    // UI State
    const [newExpense, setNewExpense] = useState<Partial<Expense>>({
        name: "",
        category: CATEGORIES[0],
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        isRecurring: false
    })

    // Persistence
    useEffect(() => {
        const loadData = () => {
            try {
                const savedData = localStorage.getItem('family_spending_data')
                if (savedData) {
                    const parsed = JSON.parse(savedData)
                    setCurrency(parsed.currency || CURRENCIES[0])
                    setIncome(parsed.income || 0)
                    setBudget(parsed.budget || 0)
                    setCategoryBudgets(parsed.categoryBudgets || {})
                    setExpenses(parsed.expenses || [])
                    setSavingsGoals(parsed.savingsGoals || [])
                }
            } catch (e) {
                console.error("Failed to load local data", e)
            } finally {
                setIsLoaded(true)
            }
        }
        loadData()
    }, [])

    useEffect(() => {
        if (!isLoaded) return
        const data = {
            currency,
            income,
            budget,
            categoryBudgets,
            expenses,
            savingsGoals
        }
        localStorage.setItem('family_spending_data', JSON.stringify(data))
    }, [isLoaded, currency, income, budget, categoryBudgets, expenses, savingsGoals])

    // Calculations
    const totalExpenses = useMemo(() => expenses.reduce((acc, curr) => acc + curr.amount, 0), [expenses])
    const balance = income - totalExpenses
    const budgetUsage = budget > 0 ? (totalExpenses / budget) * 100 : 0

    const expensesByCategory = useMemo(() => {
        const grouped: Record<string, number> = {}
        expenses.forEach((exp) => {
            grouped[exp.category] = (grouped[exp.category] || 0) + exp.amount
        })
        return Object.entries(grouped)
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount)
    }, [expenses])

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat(currency.locale, {
            style: 'currency',
            currency: currency.code,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount)
    }

    // --- Actions ---

    const addExpense = () => {
        if (!newExpense.name || !newExpense.amount) return

        setExpenses([
            ...expenses,
            {
                id: crypto.randomUUID(),
                name: newExpense.name,
                category: newExpense.category || CATEGORIES[0],
                amount: Number(newExpense.amount),
                date: newExpense.date || new Date().toISOString().split("T")[0],
                isRecurring: !!newExpense.isRecurring
            },
        ])
        setNewExpense({
            name: "",
            category: CATEGORIES[0],
            amount: 0,
            date: new Date().toISOString().split("T")[0],
            isRecurring: false
        })
    }

    const removeExpense = (id: string) => {
        setExpenses(expenses.filter((e) => e.id !== id))
    }

    // --- Export/Import ---

    const exportData = () => {
        const data = {
            currency,
            income,
            budget,
            categoryBudgets,
            expenses,
            savingsGoals,
            exportedAt: new Date().toISOString()
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `family_spending_backup_${new Date().toISOString().split('T')[0]}.json`
        link.click()
    }

    const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target?.result as string)
                if (confirm("This will overwrite your current data. Are you sure?")) {
                    setCurrency(parsed.currency || CURRENCIES[0])
                    setIncome(parsed.income || 0)
                    setBudget(parsed.budget || 0)
                    setCategoryBudgets(parsed.categoryBudgets || {})
                    setExpenses(parsed.expenses || [])
                    setSavingsGoals(parsed.savingsGoals || [])
                    alert("Data imported successfully!")
                }
            } catch (err) {
                alert("Invalid JSON file")
            }
        }
        reader.readAsText(file)
    }

    // --- Visuals ---
    const TrendChart = () => {
        // Basic Trend Logic: Cumulative spend by day
        if (expenses.length === 0) return null

        // Sort expenses by date
        const sorted = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        const startDate = new Date(sorted[0].date)
        const endDate = new Date() // Today
        const dayMap = new Map<string, number>()

        // Fill map
        let runningTotal = 0
        sorted.forEach(e => {
            runningTotal += e.amount
            dayMap.set(e.date, runningTotal)
        })

        // Generate points
        const points: { x: number, y: number, date: string, val: number }[] = []
        const dates = Array.from(dayMap.keys())

        if (dates.length < 2) return <div className="text-sm text-slate-500 text-center py-10">Add more expenses to see trends</div>

        const maxVal = runningTotal * 1.1
        const width = 100
        const height = 50

        return (
            <div className="w-full h-40 flex items-end gap-1 relative mt-4">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
                    <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />

                    {/* Polyline */}
                    <polyline
                        fill="none"
                        stroke="currentColor" // Uses text color (blue or purple usually)
                        strokeWidth="2"
                        points={dates.map((d, i) => {
                            const x = (i / (dates.length - 1)) * 100
                            const val = dayMap.get(d) || 0
                            const y = height - ((val / maxVal) * height)
                            return `${x},${y}`
                        }).join(" ")}
                        className="text-blue-500 dark:text-blue-400 vector-effect-non-scaling-stroke"
                    />
                </svg>
                <div className="absolute top-2 left-2 text-xs font-mono text-slate-500">Cumulative Spend</div>
            </div>
        )
    }

    if (!isLoaded) return <div className="p-10 text-center">Loading...</div>

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Navigation Tabs */}
            <div className="flex gap-1 lg:gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto no-scrollbar">
                {[
                    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
                    { id: 'history', label: 'Transactions', icon: FileText },
                    { id: 'tools', label: 'Smart Tools', icon: Users },
                    { id: 'settings', label: 'Settings', icon: Settings },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-t-lg text-xs lg:text-sm font-medium transition-colors shrink-0 whitespace-nowrap ${activeTab === tab.id
                            ? "bg-white dark:bg-slate-900 border-x border-t border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 relative -mb-1 pb-3 lg:pb-3"
                            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            }`}
                    >
                        <tab.icon className="w-3.5 h-3.5 lg:w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'dashboard' && (
                <div className="space-y-6 lg:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    {/* Header Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {/* Income Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 lg:p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-full">
                                    <h3 className="text-slate-500 dark:text-slate-400 text-xs lg:text-sm font-medium mb-1">Monthly Income</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">{currency.symbol}</span>
                                        <input
                                            type="number"
                                            value={income || ""}
                                            onChange={(e) => setIncome(Number(e.target.value))}
                                            placeholder="0"
                                            className="bg-transparent text-xl lg:text-2xl font-bold text-slate-900 dark:text-white outline-none w-full placeholder:text-slate-300 dark:placeholder:text-slate-700 font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                    <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-full opacity-50" />
                            </div>
                        </div>

                        {/* Budget Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-full">
                                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Target Budget</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{currency.symbol}</span>
                                        <input
                                            type="number"
                                            value={budget || ""}
                                            onChange={(e) => setBudget(Number(e.target.value))}
                                            placeholder="0"
                                            className="bg-transparent text-2xl font-bold text-slate-900 dark:text-white outline-none w-full placeholder:text-slate-300 dark:placeholder:text-slate-700 font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${budgetUsage > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
                                    style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                                />
                            </div>
                            <div className="mt-2 text-xs flex justify-between">
                                <span className="text-slate-500">Usage</span>
                                <span className={`font-medium ${budgetUsage > 100 ? 'text-red-500' : 'text-blue-500'}`}>{budgetUsage.toFixed(0)}%</span>
                            </div>
                        </div>

                        {/* Expenses Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Expenses</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{formatMoney(totalExpenses)}</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                    <ArrowUpRight className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-purple-500 transition-all duration-500"
                                    style={{ width: `${Math.min((totalExpenses / (income || 1)) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Balance Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Net Balance</h3>
                                    <div className="flex items-center gap-1">
                                        <span className={`text-2xl font-bold font-mono ${balance >= 0 ? "text-slate-900 dark:text-white" : "text-red-600 dark:text-red-400"}`}>
                                            {formatMoney(balance)}
                                        </span>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-xl ${balance >= 0 ? "bg-slate-100 dark:bg-slate-800" : "bg-red-50 dark:bg-red-900/20"}`}>
                                    {balance >= 0 ?
                                        <CheckCircle2 className="w-5 h-5 text-slate-600 dark:text-slate-400" /> :
                                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    }
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${balance >= 0 ? "bg-slate-900 dark:bg-slate-400" : "bg-red-500"}`}
                                    style={{ width: `${Math.max(Math.min((balance / (income || 1)) * 100, 100), 0)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Input Form */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                Add New Expense
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                                    <input
                                        type="text"
                                        value={newExpense.name}
                                        onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                        placeholder="e.g., Grocery shopping"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-500">{currency.symbol}</span>
                                        <input
                                            type="number"
                                            value={newExpense.amount || ""}
                                            onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                                    <select
                                        value={newExpense.category}
                                        onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all [&>option]:bg-white dark:[&>option]:bg-slate-900"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Date</label>
                                        <input
                                            type="date"
                                            value={newExpense.date}
                                            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:[color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 md:col-span-1 pt-8">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={newExpense.isRecurring}
                                            onChange={(e) => setNewExpense({ ...newExpense, isRecurring: e.target.checked })}
                                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                                        />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">Recurring Monthly</span>
                                    </label>
                                </div>

                                <div className="md:col-span-2">
                                    <button
                                        onClick={addExpense}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-[0.98]"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add Transaction
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Analytics & Trend */}
                        <div className="space-y-6">
                            {/* Breakdown */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    Breakdown
                                </h3>
                                <div className="space-y-5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {expensesByCategory.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-500">
                                            <PieChart className="w-12 h-12 mb-3 opacity-20" />
                                            <p>No expenses recorded yet.</p>
                                        </div>
                                    ) : (
                                        expensesByCategory.map((item) => {
                                            const catBudget = categoryBudgets[item.category] || 0
                                            const isOverCatBudget = catBudget > 0 && item.amount > catBudget
                                            return (
                                                <div key={item.category} className="space-y-2">
                                                    <div className="flex justify-between text-sm font-medium">
                                                        <span className={`flex items-center gap-2 ${isOverCatBudget ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                            {item.category}
                                                            {isOverCatBudget && <AlertCircle className="w-3 h-3" />}
                                                        </span>
                                                        <span className="text-slate-900 dark:text-slate-100">
                                                            {formatMoney(item.amount)}
                                                            {catBudget > 0 && <span className="text-slate-400 text-xs font-normal ml-1">/ {formatMoney(catBudget)}</span>}
                                                        </span>
                                                    </div>
                                                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(item.amount / totalExpenses) * 100}%` }}
                                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                                            className={`h-full rounded-full ${isOverCatBudget ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'}`}
                                                        />
                                                        {catBudget > 0 && (
                                                            <div
                                                                className="absolute top-0 bottom-0 w-0.5 bg-slate-900 dark:bg-white/50"
                                                                style={{ left: `${Math.min((catBudget / totalExpenses) * 100, 100)}%` }}
                                                                title={`Budget: ${formatMoney(catBudget)}`}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Trend Chart (Mini) */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                    <LineChart className="w-5 h-5 text-blue-500" />
                                    Spending Trend
                                </h3>
                                <TrendChart />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </div>
                            History
                        </h3>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => {
                                    const csvContent = ["Date,Name,Category,Amount,Currency,Recurring"].join(",") + "\n" +
                                        expenses.map(e => `${e.date},"${e.name}",${e.category},${e.amount},${currency.code},${e.isRecurring}`).join("\n");
                                    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
                                    const link = document.createElement("a")
                                    link.href = URL.createObjectURL(blob)
                                    link.download = `spending_report_${currency.code}.csv`
                                    link.click()
                                }}
                                disabled={expenses.length === 0}
                                className="flex-1 sm:flex-none bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <FileJson className="w-4 h-4 text-green-600 dark:text-green-500" />
                                CSV
                            </button>
                            {/* PDF Export would go here (same logic as before) */}
                        </div>
                    </div>

                    <div className="overflow-x-auto no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
                        <table className="w-full text-left border-collapse min-w-[600px] lg:min-w-0">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800">
                                    <th className="pb-4 pl-4 text-[10px] lg:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Date</th>
                                    <th className="pb-4 text-[10px] lg:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Description</th>
                                    <th className="pb-4 text-[10px] lg:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Category</th>
                                    <th className="pb-4 text-[10px] lg:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold text-right">Amount</th>
                                    <th className="pb-4 pr-4 text-[10px] lg:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {expenses.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                                            No transactions yet.
                                        </td>
                                    </tr>
                                ) : (
                                    expenses.slice().reverse().map((expense) => (
                                        <tr key={expense.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="py-3 lg:py-4 pl-4 text-slate-600 dark:text-slate-300 text-[10px] lg:text-sm">{expense.date}</td>
                                            <td className="py-3 lg:py-4 text-slate-900 dark:text-white font-medium flex items-center gap-2 text-xs lg:text-sm">
                                                <span className="truncate max-w-[120px] lg:max-w-none">{expense.name}</span>
                                                {expense.isRecurring && <RefreshCw className="w-3 h-3 text-slate-400 shrink-0" />}
                                            </td>
                                            <td className="py-3 lg:py-4">
                                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 lg:px-2.5 py-1 rounded-md text-[9px] lg:text-xs font-medium border border-slate-200 dark:border-slate-700">
                                                    {expense.category}
                                                </span>
                                            </td>
                                            <td className="py-3 lg:py-4 text-right text-slate-900 dark:text-white font-mono font-medium text-xs lg:text-sm">{formatMoney(expense.amount)}</td>
                                            <td className="py-3 lg:py-4 pr-4 text-right">
                                                <button
                                                    onClick={() => removeExpense(expense.id)}
                                                    className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1.5 lg:p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'tools' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
                    {/* Bill Splitter */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            Bill Splitter
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Total Bill</label>
                                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 mt-1">
                                        <span className="text-slate-500">{currency.symbol}</span>
                                        <input type="number" id="split-total" placeholder="0" className="bg-transparent w-full outline-none" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-medium text-slate-500 uppercase">People</label>
                                    <input type="number" id="split-people" defaultValue={2} className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 mt-1 w-full outline-none" />
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    const total = Number((document.getElementById('split-total') as HTMLInputElement).value);
                                    const people = Number((document.getElementById('split-people') as HTMLInputElement).value);
                                    if (people > 0) alert(`Each person pays: ${formatMoney(total / people)}`);
                                }}
                                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium py-2 rounded-lg transition-colors"
                            >
                                Calculate Split
                            </button>
                        </div>
                    </div>

                    {/* Savings Goals (Simple) */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-emerald-500" />
                            Savings Goal Tracker
                        </h3>
                        <div className="space-y-4">
                            {savingsGoals.map(goal => (
                                <div key={goal.id} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span>{goal.name}</span>
                                        <span>{formatMoney(goal.current)} / {formatMoney(goal.target)}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }} />
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                                <div className="flex gap-2">
                                    <input type="text" id="goal-name" placeholder="Goal Name (e.g. Vacation)" className="flex-1 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 outline-none text-sm" />
                                    <input type="number" id="goal-target" placeholder="Target" className="w-24 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 outline-none text-sm" />
                                </div>
                                <button
                                    onClick={() => {
                                        const name = (document.getElementById('goal-name') as HTMLInputElement).value;
                                        const target = Number((document.getElementById('goal-target') as HTMLInputElement).value);
                                        if (name && target) {
                                            setSavingsGoals([...savingsGoals, { id: crypto.randomUUID(), name, target, current: 0 }]);
                                            (document.getElementById('goal-name') as HTMLInputElement).value = "";
                                            (document.getElementById('goal-target') as HTMLInputElement).value = "";
                                        }
                                    }}
                                    className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition-colors text-sm"
                                >
                                    Add Goal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-slate-500" />
                        Configuration
                    </h3>

                    <div className="space-y-8">
                        {/* Currency */}
                        <div className="max-w-md">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Primary Currency</label>
                            <select
                                value={currency.code}
                                onChange={(e) => setCurrency(CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[0])}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 outline-none"
                            >
                                {CURRENCIES.map(c => (
                                    <option key={c.code} value={c.code}>{c.code} - {c.locale} ({c.symbol})</option>
                                ))}
                            </select>
                        </div>

                        {/* Category Budgets */}
                        <div>
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-4">Category Budgets</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {CATEGORIES.map(cat => (
                                    <div key={cat} className="flex items-center gap-4">
                                        <span className="w-32 text-sm text-slate-600 dark:text-slate-400">{cat}</span>
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-2 text-slate-400 text-xs">{currency.symbol}</span>
                                            <input
                                                type="number"
                                                value={categoryBudgets[cat] || ""}
                                                onChange={(e) => setCategoryBudgets({ ...categoryBudgets, [cat]: Number(e.target.value) })}
                                                placeholder="No Limit"
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-6 pr-4 py-1.5 text-sm outline-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Data Management */}
                        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-4">Data Management</h4>
                            <div className="flex flex-col md:flex-row gap-4">
                                <button
                                    onClick={exportData}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-900 dark:text-white transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Backup Data (JSON)
                                </button>

                                <label className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-900 dark:text-white transition-colors cursor-pointer">
                                    <Upload className="w-4 h-4" />
                                    Restore Data
                                    <input type="file" onChange={importData} accept=".json" className="hidden" />
                                </label>

                                <button
                                    onClick={() => {
                                        if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
                                            localStorage.removeItem('family_spending_data')
                                            window.location.reload()
                                        }
                                    }}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 transition-colors ml-auto"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Reset All Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
