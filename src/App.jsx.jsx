import { useState, useMemo, useRef } from "react";

const MONTHS_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_ZH = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
const CURRENT_YEAR = new Date().getFullYear();
const EARN_CATEGORIES = ["Salary","Freelance","Investments","Bonus","Side Hustle","Gifts","Adjustment","Other"];
const EXP_CATEGORIES = ["Food","Transport","Housing","Entertainment","Utilities","Healthcare","Shopping","Education","Adjustment","Other"];
const MAX_UNDO = 30;



const T = {
  en: {
    months: MONTHS_EN,
    moneyTracker: "Sakuhin",
    fullYear: "Full Year",
    currentBalance: "Current Balance",
    edit: "edit",
    set: "Set",
    totalEarnings: "Total Earnings",
    totalExpenses: "Total Expenses",
    net: "Net",
    savedForGoals: "Saved for Goals",
    froggyBankLabel: "Froggy Bank",
    available: "Available",
    enterYear: "Enter Year",
    selectMonth: "Select Month",
    all: "All",
    viewingAllMonths: "Viewing all months. Entries are automatically sorted into the correct month based on the date you select.",
    monthlyBudget: "Monthly Budget",
    setBudget: "Set Budget",
    hide: "Hide",
    budgetLabel: "Label (e.g. Weekly groceries)",
    budgetLimit: "Budget limit ($)",
    setBtn: "+ Set",
    label: "Label",
    category: "Category",
    budgetLimitCol: "Budget Limit ($)",
    spent: "Spent ($)",
    status: "Status",
    noBudgets: "No budgets set yet — use the form above to set your first monthly budget limit",
    of: "of",
    spentWord: "spent",
    over: "over",
    remaining: "remaining",
    ofBudgetLimit: "of budget limit",
    locked: "Locked",
    unlockToEdit: "Unlock to edit",
    clickToEdit: "Click to edit",
    total: "TOTAL",
    onTrack: "ON TRACK",
    overBudget: "OVER BUDGET",
    unlockResume: "Unlock — resume tracking new expenses",
    lockStop: "Lock — stop tracking new expenses",
    earningsBreakdown: "Earnings Breakdown",
    expensesBreakdown: "Expenses Breakdown",
    goals: "Goals",
    addGoal: "+ Add Goal",
    cancel: "Cancel",
    goalName: "Goal name (e.g. Tesla Model 3)",
    targetPrice: "Target price ($)",
    chooseIcon: "Choose an icon",
    pickIcon: "Pick Icon",
    typeEmoji: "Type Emoji",
    uploadPhoto: "Upload Photo",
    emojiPlaceholder: "Type or paste any emoji (e.g. 🎯 🏖️ 👟)",
    emojiHint: "Windows: Win + . | Mac: Ctrl + Cmd + Space → opens emoji keyboard",
    clickBrowse: "Click to browse or drag & drop",
    fileTypes: "JPG, PNG, WEBP — any image from your device",
    removePhoto: "Remove photo",
    autoMatched: "Auto-matched:",
    aiPicked: "AI picked:",
    preview: "Preview:",
    notRight: "not right? pick below",
    aiPickIcon: "Ask AI to pick an icon",
    findingIcon: "Finding icon...",
    addGoalBtn: "Add Goal",
    noGoals: "No goals yet — add something you're saving for!",
    saved: "saved of",
    goalReached: "GOAL REACHED!",
    fullyFunded: "Fully funded!",
    toGo: "to go",
    amount: "$ amount",
    add: "+ Add",
    take: "− Take",
    useFromFroggy: "Use from Froggy Bank",
    froggyBankTitle: "Froggy Bank",
    froggyDesc: "Collects leftover dollars from locked budgets",
    savedFrom: "Saved from",
    savedHistory: "Saved History",
    viewHistory: "View History",
    hideHistory: "Hide",
    noHistory: "No records for this period",
    historyIn: "IN",
    historyOut: "OUT",
    startingBalance: "Starting Balance",
    onboardTitle: "Welcome to Sakuhin",
    onboardStep1: "What's your current balance right now?",
    onboardStep1Hint: "This becomes your starting point. All future earnings and expenses will be tracked from here.",
    onboardStep2: "Want to add past records?",
    onboardStep2Hint: "If you add past earnings or expenses, your displayed balance will adjust automatically. You can always add a Balance Correction later if the numbers drift.",
    onboardStart: "Start Tracking",
    onboardSkip: "Skip, I'll add records later",
    balanceCorrection: "Balance Correction",
    addCorrection: "+ Correction",
    correctionHint: "Adjust if your calculated balance doesn't match reality",
    calculatedBalance: "Calculated Balance",
    iKnowStarting: "I know my starting balance",
    iKnowCurrent: "I only know my current balance",
    currentBalanceNow: "What's your balance right now?",
    currentBalanceHint: "Enter what's in your account today. After you add your past records, we'll calculate what your starting balance was.",
    addRecordsFirst: "Add your past earnings and expenses below, then confirm.",
    confirmRecords: "Confirm & Calculate",
    calculatedStarting: "Your calculated starting balance",
    looksGood: "Looks good — start tracking!",
    goBack: "Go back",
    lockBudgetHint: "Lock a budget with remaining money to start saving",
    setBudgetFirst: "Set a monthly budget first, then lock it when done",
    earnings: "Earnings",
    expenses: "Expenses",
    allMonths: "All Months",
    earningLabel: "Label (e.g. Salary)",
    expenseLabel: "Label (e.g. Rent)",
    amountDollar: "Amount ($)",
    date: "Date",
    source: "Source",
    item: "Item",
    noEarnings: "No earnings added yet",
    noExpenses: "No expenses added yet",
    undo: "Undo",
    undid: "Undid",
    addEarningAction: "Add earning",
    addExpenseAction: "Add expense",
    removeEarningAction: "Remove earning",
    removeExpenseAction: "Remove expense",
    addBudgetAction: "Add budget",
    removeBudgetAction: "Remove budget",
    toggleLockAction: "Toggle budget lock",
    editBudgetAction: "Edit budget",
    addGoalAction: "Add goal",
    removeGoalAction: "Remove goal",
    fundGoalAction: "Fund goal",
    withdrawGoalAction: "Withdraw from goal",
    froggyTransferAction: "Transfer from Froggy Bank",
    adjust: "− Adjust",
    confirm: "Confirm",
    budgetReached: "Budget reached",
    fromBalance: "From Balance",
    fromFroggy: "From Froggy Bank",
    toBalance: "To Balance",
    toFroggy: "To Froggy Bank",
    addFunds: "Add Funds",
    withdraw: "Withdraw",
    thisMonth: "This Month Only",
    allMonthsScope: "All Months",
  },
  zh: {
    months: MONTHS_ZH,
    moneyTracker: "Sakuhin",
    fullYear: "全年",
    currentBalance: "当前余额",
    edit: "编辑",
    set: "确定",
    totalEarnings: "总收入",
    totalExpenses: "总支出",
    net: "净额",
    savedForGoals: "目标储蓄",
    froggyBankLabel: "青蛙银行",
    available: "可用余额",
    enterYear: "输入年份",
    selectMonth: "选择月份",
    all: "全部",
    viewingAllMonths: "正在查看全年数据。新条目将根据所选日期自动归入对应月份。",
    monthlyBudget: "月度预算",
    setBudget: "设置预算",
    hide: "隐藏",
    budgetLabel: "标签（如：每周买菜）",
    budgetLimit: "预算上限（$）",
    setBtn: "+ 设置",
    label: "标签",
    category: "类别",
    budgetLimitCol: "预算上限（$）",
    spent: "已花费（$）",
    status: "状态",
    noBudgets: "暂无预算 — 使用上方表单设置您的第一个月度预算",
    of: "/",
    spentWord: "已花费",
    over: "超出",
    remaining: "剩余",
    ofBudgetLimit: "预算上限",
    locked: "已锁定",
    unlockToEdit: "解锁后可编辑",
    clickToEdit: "点击编辑",
    total: "合计",
    onTrack: "正常",
    overBudget: "超出预算",
    unlockResume: "解锁 — 恢复追踪新支出",
    lockStop: "锁定 — 停止追踪新支出",
    earningsBreakdown: "收入分布",
    expensesBreakdown: "支出分布",
    goals: "目标",
    addGoal: "+ 添加目标",
    cancel: "取消",
    goalName: "目标名称（如：特斯拉 Model 3）",
    targetPrice: "目标金额（$）",
    chooseIcon: "选择图标",
    pickIcon: "选择图标",
    typeEmoji: "输入表情",
    uploadPhoto: "上传图片",
    emojiPlaceholder: "输入或粘贴表情符号（如：🎯 🏖️ 👟）",
    emojiHint: "Windows: Win + . | Mac: Ctrl + Cmd + Space → 打开表情键盘",
    clickBrowse: "点击浏览或拖放文件",
    fileTypes: "JPG、PNG、WEBP — 设备上的任何图片",
    removePhoto: "移除图片",
    autoMatched: "自动匹配：",
    aiPicked: "AI 选择：",
    preview: "预览：",
    notRight: "不对？在下方选择",
    aiPickIcon: "让 AI 选择图标",
    findingIcon: "正在寻找图标...",
    addGoalBtn: "添加目标",
    noGoals: "暂无目标 — 添加您想存钱购买的物品！",
    saved: "已存",
    goalReached: "目标达成！",
    fullyFunded: "已全额储蓄！",
    toGo: "还差",
    amount: "$ 金额",
    add: "+ 添加",
    take: "− 取出",
    useFromFroggy: "从青蛙银行转入",
    froggyBankTitle: "青蛙银行",
    froggyDesc: "收集锁定预算的剩余资金",
    savedFrom: "来源",
    savedHistory: "存储记录",
    viewHistory: "查看记录",
    hideHistory: "隐藏",
    noHistory: "该时段无记录",
    historyIn: "存入",
    historyOut: "支出",
    startingBalance: "初始余额",
    onboardTitle: "欢迎使用 Sakuhin",
    onboardStep1: "您现在的余额是多少？",
    onboardStep1Hint: "这将成为您的起始点。所有未来的收入和支出都将从这里开始追踪。",
    onboardStep2: "要添加过去的记录吗？",
    onboardStep2Hint: "如果添加过去的收入或支出，显示的余额会自动调整。您可以随时添加余额校正来修正差异。",
    onboardStart: "开始追踪",
    onboardSkip: "跳过，稍后再添加",
    balanceCorrection: "余额校正",
    addCorrection: "+ 校正",
    correctionHint: "当计算余额与实际不符时进行调整",
    calculatedBalance: "计算余额",
    iKnowStarting: "我知道初始余额",
    iKnowCurrent: "我只知道当前余额",
    currentBalanceNow: "您现在的余额是多少？",
    currentBalanceHint: "输入您账户中现在的金额。添加过去的记录后，我们会自动计算您的初始余额。",
    addRecordsFirst: "在下方添加您过去的收入和支出记录，然后确认。",
    confirmRecords: "确认并计算",
    calculatedStarting: "您的计算初始余额",
    looksGood: "没问题 — 开始追踪！",
    goBack: "返回",
    lockBudgetHint: "锁定有剩余的预算即可开始存钱",
    setBudgetFirst: "先设置月度预算，完成后锁定即可",
    earnings: "收入",
    expenses: "支出",
    allMonths: "全部月份",
    earningLabel: "标签（如：工资）",
    expenseLabel: "标签（如：房租）",
    amountDollar: "金额（$）",
    date: "日期",
    source: "来源",
    item: "项目",
    noEarnings: "暂无收入记录",
    noExpenses: "暂无支出记录",
    undo: "撤销",
    undid: "已撤销",
    addEarningAction: "添加收入",
    addExpenseAction: "添加支出",
    removeEarningAction: "删除收入",
    removeExpenseAction: "删除支出",
    addBudgetAction: "添加预算",
    removeBudgetAction: "删除预算",
    toggleLockAction: "切换预算锁定",
    editBudgetAction: "编辑预算",
    addGoalAction: "添加目标",
    removeGoalAction: "删除目标",
    fundGoalAction: "为目标存款",
    withdrawGoalAction: "从目标取款",
    froggyTransferAction: "从青蛙银行转入",
    adjust: "− 调整",
    confirm: "确认",
    budgetReached: "已达上限",
    fromBalance: "从余额",
    fromFroggy: "从青蛙银行",
    toBalance: "到余额",
    toFroggy: "到青蛙银行",
    addFunds: "存入",
    withdraw: "取出",
    thisMonth: "仅本月",
    allMonthsScope: "所有月份",
  },
  earnCat: {
    en: { Salary: "Salary", Freelance: "Freelance", Investments: "Investments", Bonus: "Bonus", "Side Hustle": "Side Hustle", Gifts: "Gifts", Adjustment: "Adjustment", Other: "Other" },
    zh: { Salary: "工资", Freelance: "自由职业", Investments: "投资", Bonus: "奖金", "Side Hustle": "副业", Gifts: "礼物", Adjustment: "校正", Other: "其他" },
  },
  expCat: {
    en: { Food: "Food", Transport: "Transport", Housing: "Housing", Entertainment: "Entertainment", Utilities: "Utilities", Healthcare: "Healthcare", Shopping: "Shopping", Education: "Education", Adjustment: "Adjustment", Other: "Other" },
    zh: { Food: "餐饮", Transport: "交通", Housing: "住房", Entertainment: "娱乐", Utilities: "水电", Healthcare: "医疗", Shopping: "购物", Education: "教育", Adjustment: "校正", Other: "其他" },
  },
};

const defaultYearData = () => {
  const d = {};
  MONTHS_EN.forEach((_, i) => { d[i] = { earnings: [], expenses: [] }; });
  return d;
};
let nextId = 1;

// ─── EARNING ICONS (Garden / Growth theme) ───
const EarnIcons = {
  Salary: ({ a, o }) => (<>
    <rect x="10" y="12" width="40" height="46" rx="2" fill={a?"#4a7a4a":"#444"} opacity={o}/>
    <rect x="14" y="16" width="10" height="7" rx="1" fill={a?"#7eb87d":"#555"} opacity={o}/>
    <rect x="28" y="16" width="10" height="7" rx="1" fill={a?"#7eb87d":"#555"} opacity={o}/>
    <rect x="14" y="27" width="10" height="7" rx="1" fill={a?"#a3d4a2":"#555"} opacity={o}/>
    <rect x="28" y="27" width="10" height="7" rx="1" fill={a?"#a3d4a2":"#555"} opacity={o}/>
    <rect x="14" y="38" width="10" height="7" rx="1" fill={a?"#7eb87d":"#555"} opacity={o}/>
    <rect x="28" y="38" width="10" height="7" rx="1" fill={a?"#7eb87d":"#555"} opacity={o}/>
    <rect x="24" y="48" width="12" height="10" rx="1" fill={a?"#b0ccb0":"#555"} opacity={o}/>
    <polygon points="2,14 30,-4 58,14" fill={a?"#065f46":"#3a3a3a"} opacity={o}/>
    {a&&<rect x="28" y="-8" width="4" height="8" fill="#5a8a5a" opacity={0.8}/>}
    {a&&<polygon points="26,-8 30,-16 34,-8" fill="#7eb87d" opacity={0.7}/>}
  </>),
  Freelance: ({ a, o }) => (<>
    <rect x="6" y="18" width="48" height="30" rx="3" fill={a?"#5b21b6":"#444"} opacity={o}/>
    <rect x="10" y="22" width="40" height="22" rx="2" fill={a?"#6b5ab4":"#555"} opacity={o}/>
    {a&&<><text x="30" y="37" textAnchor="middle" fill="#c4b5fd" fontSize="8" fontFamily="monospace" opacity={0.9}>{"< / >"}</text>
    <rect x="14" y="27" width="16" height="2" rx="1" fill="#9b8ad4" opacity={0.4}/>
    <rect x="14" y="31" width="12" height="2" rx="1" fill="#9b8ad4" opacity={0.3}/></>}
    <path d="M2,48 L58,48 L54,52 Q30,56 6,52 Z" fill={a?"#4c1d95":"#3a3a3a"} opacity={o}/>
    {a&&<circle cx="30" cy="54" r="2" fill="#6b5ab4" opacity={0.5}/>}
  </>),
  Investments: ({ a, o }) => (<>
    <rect x="8" y="50" width="44" height="8" rx="2" fill={a?"#6b5020":"#444"} opacity={o}/>
    <line x1="14" y1="50" x2="14" y2="40" stroke={a?"#5a8a5a":"#555"} strokeWidth="3" opacity={o}/>
    <ellipse cx="14" cy="36" rx="6" ry="5" fill={a?"#7eb87d":"#555"} opacity={o}/>
    {a&&<ellipse cx="11" cy="34" rx="4" ry="3" fill="#a3d4a2" opacity={0.5}/>}
    <line x1="30" y1="50" x2="30" y2="28" stroke={a?"#5a8a5a":"#555"} strokeWidth="3" opacity={o}/>
    <ellipse cx="30" cy="24" rx="8" ry="6" fill={a?"#6b9c6b":"#555"} opacity={o}/>
    {a&&<ellipse cx="27" cy="22" rx="5" ry="4" fill="#a3d4a2" opacity={0.4}/>}
    <line x1="46" y1="50" x2="46" y2="16" stroke={a?"#5a8a5a":"#555"} strokeWidth="4" opacity={o}/>
    <ellipse cx="46" cy="12" rx="10" ry="7" fill={a?"#7eb87d":"#555"} opacity={o}/>
    {a&&<><ellipse cx="42" cy="10" rx="6" ry="5" fill="#a3d4a2" opacity={0.4}/>
    <circle cx="46" cy="8" r="3" fill="#d4b85c" opacity={0.8}/>
    <text x="46" y="10" textAnchor="middle" fill="#6b5020" fontSize="4" fontWeight="700">$</text></>}
  </>),
  Bonus: ({ a, o }) => (<>
    <rect x="14" y="28" width="32" height="28" rx="3" fill={a?"#b04848":"#444"} opacity={o}/>
    <rect x="10" y="22" width="40" height="10" rx="3" fill={a?"#c45c5c":"#555"} opacity={o}/>
    <rect x="27" y="22" width="6" height="34" fill={a?"#fecdd3":"#555"} opacity={o}/>
    <rect x="10" y="33" width="40" height="4" fill={a?"#fecdd3":"#555"} opacity={o}/>
    <path d="M30,22 Q20,6 12,16" stroke={a?"#d4b85c":"#555"} strokeWidth="3" fill="none" opacity={o}/>
    <path d="M30,22 Q40,6 48,16" stroke={a?"#d4b85c":"#555"} strokeWidth="3" fill="none" opacity={o}/>
    {a&&<><circle cx="12" cy="14" r="3" fill="#d4b85c" opacity={0.8}/>
    <circle cx="48" cy="14" r="3" fill="#d4b85c" opacity={0.8}/></>}
  </>),
  "Side Hustle": ({ a, o }) => (<>
    <path d="M16,20 L16,52 Q16,56 20,56 L40,56 Q44,56 44,52 L44,20 Q44,16 40,16 L20,16 Q16,16 16,20 Z" fill={a?"#ea580c":"#444"} opacity={o}/>
    <path d="M44,30 Q56,30 56,40 Q56,50 44,50" stroke={a?"#fb923c":"#555"} strokeWidth="3" fill="none" opacity={o}/>
    <ellipse cx="30" cy="58" rx="16" ry="3" fill={a?"#9a3412":"#3a3a3a"} opacity={o}/>
    {a&&<><path d="M24,12 Q24,4 28,8" stroke="#fdba74" strokeWidth="2" fill="none" opacity={0.7}/>
    <path d="M30,10 Q30,2 34,6" stroke="#fed7aa" strokeWidth="2" fill="none" opacity={0.6}/>
    <path d="M36,12 Q36,6 40,10" stroke="#fdba74" strokeWidth="1.5" fill="none" opacity={0.5}/></>}
  </>),
  Gifts: ({ a, o }) => (<>
    <path d="M30,56 L8,34 Q2,20 16,16 Q26,13 30,28 Q34,13 44,16 Q58,20 52,34 Z" fill={a?"#e11d48":"#444"} opacity={o}/>
    {a&&<><path d="M30,56 L8,34 Q2,20 16,16 Q26,13 30,28 Q34,13 44,16 Q58,20 52,34 Z" fill="none" stroke="#fda4af" strokeWidth="1.5" opacity={0.5}/>
    <path d="M20,22 Q24,28 30,28" stroke="#fecdd3" strokeWidth="1" fill="none" opacity={0.6}/>
    <path d="M40,22 Q36,28 30,28" stroke="#fecdd3" strokeWidth="1" fill="none" opacity={0.6}/></>}
  </>),
  Other: ({ a, o }) => (<>
    <circle cx="30" cy="32" r="20" fill={a?"#0e7490":"#444"} opacity={o}/>
    <circle cx="30" cy="32" r="14" fill={a?"#06b6d4":"#555"} opacity={o} strokeWidth="0"/>
    <text x="30" y="37" textAnchor="middle" fill={a?"#ecfeff":"#777"} fontSize="18" fontWeight="700" opacity={o}>+</text>
    {a&&<circle cx="30" cy="32" r="20" fill="none" stroke="#9cc8a0" strokeWidth="1.5" opacity={0.3} strokeDasharray="4 3"/>}
  </>),
};

// ─── EXPENSE ICONS (Cityscape / Life theme) ───
const ExpIcons = {
  Food: ({ a, o }) => (<>
    <circle cx="30" cy="34" r="20" fill={a?"#991b1b":"#444"} opacity={o}/>
    <circle cx="30" cy="34" r="16" fill={a?"#fecaca":"#555"} opacity={o}/>
    <circle cx="30" cy="34" r="10" fill={a?"#dba097":"#555"} opacity={o}/>
    {a&&<><circle cx="26" cy="32" r="3" fill="#c45c5c" opacity={0.7}/>
    <circle cx="34" cy="30" r="2" fill="#b04848" opacity={0.6}/>
    <circle cx="30" cy="38" r="2.5" fill="#d4776a" opacity={0.5}/>
    <rect x="6" y="14" width="2.5" height="22" rx="1" fill="#d4b85c" opacity={0.9}/>
    <rect x="2" y="14" width="2" height="14" rx="1" fill="#d4b85c" opacity={0.8}/>
    <rect x="10" y="14" width="2" height="14" rx="1" fill="#d4b85c" opacity={0.8}/>
    <rect x="6" y="12" width="2.5" height="4" rx="1" fill="#c9a84c" opacity={0.9}/></>}
  </>),
  Transport: ({ a, o }) => (<>
    <rect x="4" y="30" width="52" height="20" rx="5" fill={a?"#1e40af":"#444"} opacity={o}/>
    <path d="M12,30 L18,14 L42,14 L48,30" fill={a?"#2563eb":"#555"} opacity={o}/>
    <rect x="20" y="16" width="8" height="12" rx="2" fill={a?"#93c5fd":"#666"} opacity={o}/>
    <rect x="32" y="16" width="8" height="12" rx="2" fill={a?"#93c5fd":"#666"} opacity={o}/>
    <circle cx="16" cy="50" r="6" fill={a?"#1e3a8a":"#3a3a3a"} opacity={o}/>
    <circle cx="16" cy="50" r="3" fill={a?"#6b6580":"#555"} opacity={o}/>
    <circle cx="44" cy="50" r="6" fill={a?"#1e3a8a":"#3a3a3a"} opacity={o}/>
    <circle cx="44" cy="50" r="3" fill={a?"#6b6580":"#555"} opacity={o}/>
    {a&&<><rect x="4" y="38" width="12" height="3" rx="1" fill="#d4b85c" opacity={0.9}/>
    <rect x="44" y="38" width="12" height="3" rx="1" fill="#d4776a" opacity={0.8}/></>}
  </>),
  Housing: ({ a, o }) => (<>
    <rect x="10" y="28" width="40" height="30" fill={a?"#6b5020":"#444"} opacity={o}/>
    <polygon points="-2,30 30,4 62,30" fill={a?"#b45309":"#555"} opacity={o}/>
    <rect x="24" y="40" width="12" height="18" rx="1" fill={a?"#d4b85c":"#555"} opacity={o}/>
    {a&&<circle cx="33" cy="50" r="1.5" fill="#6b5020"/>}
    <rect x="14" y="32" width="8" height="8" rx="1" fill={a?"#fde68a":"#555"} opacity={o}/>
    <rect x="38" y="32" width="8" height="8" rx="1" fill={a?"#fde68a":"#555"} opacity={o}/>
    {a&&<><line x1="18" y1="32" x2="18" y2="40" stroke="#d97706" strokeWidth="0.8" opacity={0.5}/>
    <line x1="14" y1="36" x2="22" y2="36" stroke="#d97706" strokeWidth="0.8" opacity={0.5}/>
    <rect x="42" y="14" width="6" height="16" rx="1" fill="#78716c" opacity={0.7}/>
    <rect x="44" y="10" width="2" height="6" fill="#a8a29e" opacity={0.6}/></>}
  </>),
  Entertainment: ({ a, o }) => (<>
    <rect x="4" y="22" width="52" height="26" rx="13" fill={a?"#5b21b6":"#444"} opacity={o}/>
    <circle cx="18" cy="33" r="4" fill={a?"#c4b5fd":"#555"} opacity={o}/>
    <rect x="14" y="31" width="8" height="2.5" rx="1" fill={a?"#ddd6fe":"#555"} opacity={o}/>
    <rect x="16.5" y="28" width="2.5" height="8" rx="1" fill={a?"#ddd6fe":"#555"} opacity={o}/>
    <circle cx="40" cy="29" r="3" fill={a?"#9b8ad4":"#555"} opacity={o}/>
    <circle cx="46" cy="35" r="3" fill={a?"#c4b5fd":"#555"} opacity={o}/>
    <circle cx="40" cy="39" r="2.5" fill={a?"#7c6bc4":"#555"} opacity={o}/>
    <circle cx="34" cy="35" r="2.5" fill={a?"#ddd6fe":"#555"} opacity={o}/>
    <path d="M12,48 Q8,58 16,58 L22,58 Q16,48 12,48" fill={a?"#4c1d95":"#3a3a3a"} opacity={o}/>
    <path d="M48,48 Q52,58 44,58 L38,58 Q44,48 48,48" fill={a?"#4c1d95":"#3a3a3a"} opacity={o}/>
    {a&&<><circle cx="40" cy="29" r="1.2" fill="#ede9fe"/>
    <circle cx="46" cy="35" r="1.2" fill="#ede9fe"/></>}
  </>),
  Utilities: ({ a, o }) => (<>
    <polygon points="34,4 16,32 26,32 22,58 46,26 34,26" fill={a?"#ca8a04":"#444"} opacity={o}/>
    {a&&<><polygon points="34,4 16,32 26,32 22,58 46,26 34,26" fill="none" stroke="#fde68a" strokeWidth="2" opacity={0.3}/>
    <polygon points="34,12 22,30 28,30 26,48 40,28 34,28" fill="#fef08a" opacity={0.25}/></>}
  </>),
  Healthcare: ({ a, o }) => (<>
    <circle cx="30" cy="32" r="22" fill={a?"#991b1b":"#444"} opacity={o}/>
    <circle cx="30" cy="32" r="18" fill={a?"#b04848":"#555"} opacity={o}/>
    <rect x="24" y="18" width="12" height="28" rx="3" fill={a?"#fef2f2":"#666"} opacity={o}/>
    <rect x="16" y="26" width="28" height="12" rx="3" fill={a?"#fef2f2":"#666"} opacity={o}/>
    {a&&<circle cx="30" cy="32" r="18" fill="none" stroke="#fecaca" strokeWidth="1" opacity={0.4} strokeDasharray="3 2"/>}
  </>),
  Shopping: ({ a, o }) => (<>
    <path d="M12,22 L10,56 Q10,58 12,58 L48,58 Q50,58 50,56 L48,22 Z" fill={a?"#be123c":"#444"} opacity={o}/>
    <path d="M20,22 Q20,8 30,8 Q40,8 40,22" stroke={a?"#fda4af":"#555"} strokeWidth="3" fill="none" opacity={o}/>
    {a&&<><path d="M20,22 Q20,8 30,8 Q40,8 40,22" stroke="#fecdd3" strokeWidth="1.5" fill="none" opacity={0.3}/>
    <circle cx="30" cy="38" r="6" fill="#fecdd3" opacity={0.9}/>
    <circle cx="30" cy="38" r="3" fill="#be123c" opacity={0.8}/>
    <rect x="16" y="46" width="28" height="1" fill="#fda4af" opacity={0.3}/></>}
    {!a&&<circle cx="30" cy="38" r="5" fill="#555" opacity={o}/>}
  </>),
  Education: ({ a, o }) => (<>
    <polygon points="30,12 2,28 30,44 58,28" fill={a?"#1e40af":"#444"} opacity={o}/>
    <polygon points="30,16 8,28 30,40 52,28" fill={a?"#2563eb":"#555"} opacity={o}/>
    <path d="M18,32 L18,48 Q18,52 30,54 Q42,52 42,48 L42,32" fill={a?"#1d4ed8":"#555"} opacity={o}/>
    {a&&<path d="M18,32 L18,48 Q18,52 30,54 Q42,52 42,48 L42,32" fill="none" stroke="#60a5fa" strokeWidth="1" opacity={0.4}/>}
    <line x1="52" y1="28" x2="52" y2="54" stroke={a?"#d4b85c":"#555"} strokeWidth="2.5" opacity={o}/>
    <circle cx="52" cy="56" r="3.5" fill={a?"#d4b85c":"#555"} opacity={o}/>
    {a&&<circle cx="52" cy="56" r="1.5" fill="#c9a84c" opacity={0.8}/>}
  </>),
  Other: ({ a, o }) => (<>
    <circle cx="30" cy="32" r="20" fill={a?"#4a4460":"#444"} opacity={o}/>
    <circle cx="30" cy="32" r="15" fill={a?"#68627a":"#555"} opacity={o}/>
    <circle cx="22" cy="30" r="2.5" fill={a?"#d1d5db":"#666"} opacity={o}/>
    <circle cx="30" cy="30" r="2.5" fill={a?"#d1d5db":"#666"} opacity={o}/>
    <circle cx="38" cy="30" r="2.5" fill={a?"#d1d5db":"#666"} opacity={o}/>
    {a&&<circle cx="30" cy="32" r="20" fill="none" stroke="#9ca3af" strokeWidth="1" opacity={0.3} strokeDasharray="4 3"/>}
  </>),
};

// ─── SCENE COMPONENT ───
function FinancialScene({ type, data, categories, Icons, t, catNames, mode }) {
  const total = data.reduce((s, e) => s + e.amount, 0);
  const catData = {};
  categories.forEach(c => { catData[c] = 0; });
  data.forEach(e => {
    const cat = e.category || "Other";
    if (catData[cat] !== undefined) catData[cat] += e.amount;
    else catData["Other"] += e.amount;
  });
  const catList = categories.map(c => ({
    name: c, amount: catData[c],
    pct: total > 0 ? (catData[c] / total) * 100 : 0,
    active: catData[c] > 0,
  }));

  const isE = type === "earning";
  const dk = mode === "dark";
  const cols = categories.length;
  const spacing = 680 / cols;
  const fmt = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Generate scene-specific particles
  const particles = useMemo(() => Array.from({ length: 35 }, (_, i) => ({
    x: (i * 19.4 + 7) % 680,
    y: 6 + ((i * 13 + 5) % 80),
    r: 0.6 + (i % 4) * 0.5,
    delay: (i * 0.3) % 4,
    speed: 2 + (i % 3),
  })), []);

  const sceneCSS = "@keyframes float-" + type + " { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} } " +
    "@keyframes twinkle-" + type + " { 0%,100%{opacity:0.15} 50%{opacity:0.8} } " +
    ".scene-icon-" + type + " { transition: filter 0.6s ease, opacity 0.6s ease; } " +
    ".scene-icon-" + type + ".inactive { filter: grayscale(100%) brightness(0.5); } " +
    ".scene-icon-" + type + ".active { filter: none; }";

  return (
    <div style={{
      borderRadius: 14, overflow: "hidden", border: "1px solid #2a2440",
      marginBottom: 16, background: "var(--bg3)", position: "relative",
    }}>
      <style>{sceneCSS}</style>
      <div style={{ padding: "12px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: isE ? "#7eb87d" : "#d4776a" }}>
          {isE ? "↗ " + t.earningsBreakdown : "↘ " + t.expensesBreakdown}
        </h3>
        <span style={{ fontSize: 13, color: "var(--textMuted)", fontFamily: "'Space Mono', monospace" }}>
          {t.total}: ${fmt(total)}
        </span>
      </div>

      <svg viewBox="0 0 680 245" style={{ width: "100%", display: "block" }}>
        <defs>
          <linearGradient id={"sky-" + type} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={dk ? (isE ? "#0f1a0f" : "#0c0a1a") : (isE ? "#d8ece8" : "#f5e8ee")}/>
            <stop offset="60%" stopColor={dk ? (isE ? "#2a4a2a" : "#1e1b4b") : (isE ? "#c0ddd8" : "#e8d0e0")}/>
            <stop offset="100%" stopColor={dk ? (isE ? "#065f46" : "#312e81") : (isE ? "#a8d0c8" : "#d8b8d0")}/>
          </linearGradient>
          <radialGradient id={"moon-" + type}><stop offset="0%" stopColor={isE?"#c8dcc8":"#c7d2fe"}/><stop offset="100%" stopColor={isE?"#a3d4a2":"#c9a0dc"} stopOpacity="0"/></radialGradient>
        </defs>
        <rect width="680" height="245" fill={"url(#sky-" + type + ")"}/>

        {/* Moon / Sun */}
        <circle cx={isE ? 600 : 80} cy="40" r="16" fill={isE ? "#b0ccb0" : "#c7d2fe"} opacity={total > 0 ? 0.9 : 0.2} style={{ transition: "opacity 1s ease" }}/>
        <circle cx={isE ? 600 : 80} cy="40" r="30" fill={"url(#moon-" + type + ")"} opacity={total > 0 ? 0.3 : 0.05} style={{ transition: "opacity 1s ease" }}/>

        {/* Stars / particles */}
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r}
            fill={total > 0 ? (isE ? "#a3d4a2" : "#a8a0cc") : (dk ? "#2e2a3a" : "#e0d4c8")}
            opacity={total > 0 ? 0.3 : 0.1}
            style={{ animation: total > 0 ? "twinkle-" + type + " " + p.speed + "s ease-in-out " + p.delay + "s infinite" : "none", transition: "fill 1s ease" }}
          />
        ))}

        {/* Hills / background landscape */}
        <ellipse cx="120" cy="180" rx="160" ry="30" fill={dk ? (isE ? "#053b2e" : "#1a1640") : (isE ? "#b8d8d0" : "#e0c8d8")} opacity={total > 0 ? 0.6 : 0.2} style={{ transition: "opacity 0.8s ease" }}/>
        <ellipse cx="480" cy="182" rx="200" ry="25" fill={dk ? (isE ? "#042f26" : "#171340") : (isE ? "#c0ddd4" : "#e8d0dc")} opacity={total > 0 ? 0.5 : 0.15} style={{ transition: "opacity 0.8s ease" }}/>
        <ellipse cx="340" cy="178" rx="280" ry="20" fill={dk ? (isE ? "#2a4a2a" : "#1e1b4b") : (isE ? "#d0e8e0" : "#f0d8e8")} opacity={total > 0 ? 0.4 : 0.1} style={{ transition: "opacity 0.8s ease" }}/>

        {/* Ground plane */}
        <rect x="0" y="175" width="680" height="70" fill={total > 0 ? (dk ? (isE ? "#2a4a2a" : "#1e1b4b") : (isE ? "#c8e0d8" : "#edd0e0")) : (dk ? "#151525" : "#e8ddd0")} style={{ transition: "fill 0.8s ease" }}/>
        <rect x="0" y="175" width="680" height="2" fill={total > 0 ? (isE ? "#7eb87d" : "#c9a0dc") : (dk ? "#222" : "#e0d0c0")} opacity={total > 0 ? 0.15 : 0.05} style={{ transition: "opacity 0.8s ease" }}/>

        {/* Category icons */}
        {catList.map((cat, i) => {
          const Icon = Icons[cat.name];
          if (!Icon) return null;
          const iconScale = 0.9;
          const x = spacing * i + spacing / 2 - 30;
          const y = 105;
          const op = cat.active ? Math.max(0.7, Math.min(1, 0.6 + cat.pct / 100)) : 0.2;

          return (
            <g key={cat.name}>

              {/* Floating animation wrapper */}
              <g style={{
                animation: cat.active ? "float-" + type + " " + (7 + i % 3) + "s ease-in-out " + (i * 0.5) + "s infinite" : "none",
              }}>
                <g
                  className={"scene-icon-" + type + " " + (cat.active ? "active" : "inactive")}
                  transform={"translate(" + x + ", " + y + ") scale(" + iconScale + ")"}
                >
                  <Icon a={cat.active} o={op}/>
                </g>
              </g>

              {/* Label */}
              <text x={x + 30} y={192} textAnchor="middle"
                fill={cat.active ? (isE ? "#a3d4a2" : "#c7d2fe") : (dk ? "#3d3850" : "#c8b8c0")}
                fontSize="9" fontWeight={cat.active ? "600" : "400"}
                style={{ transition: "fill 0.5s ease" }}>
                {catNames[cat.name] || cat.name}
              </text>

              {/* Percentage */}
              <text x={x + 30} y={204} textAnchor="middle"
                fill={cat.active ? (isE ? "#7eb87d" : "#c9a0dc") : (dk ? "#2a2834" : "#d0c0c8")}
                fontSize={cat.active ? "11" : "9"} fontWeight="700" fontFamily="'Space Mono', monospace"
                style={{ transition: "all 0.5s ease" }}>
                {cat.active ? cat.pct.toFixed(1) + "%" : "0%"}
              </text>

              {/* Amount */}
              <text x={x + 30} y={217} textAnchor="middle"
                fill={cat.active ? "#9590a8" : "#2a2834"}
                fontSize={cat.active ? "11" : "9"} fontWeight="500" fontFamily="'Space Mono', monospace"
                style={{ transition: "all 0.5s ease" }}>
                {cat.active ? "$" + fmt(cat.amount) : ""}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}


// ─── MAIN APP ───
export default function ExpenseTracker() {
  // Load saved data
  const loadData = (key, fallback) => {
    try {
      const saved = localStorage.getItem("sakuhin_" + key);
      return saved ? JSON.parse(saved) : fallback;
    } catch { return fallback; }
  };

  const [lang, setLang] = useState(() => loadData("lang", "en"));
  const [mode, setMode] = useState(() => loadData("mode", "dark"));
  const t = T[lang];
  const MONTHS = t.months;
  const eCat = T.earnCat[lang];
  const xCat = T.expCat[lang];

  const [startingBalance, setStartingBalance] = useState(() => loadData("balance", ""));
  const [onboarded, setOnboarded] = useState(() => loadData("onboarded", false));
  const [editingBalance, setEditingBalance] = useState(false);
  const [onboardMode, setOnboardMode] = useState(null); // null, "starting", "current"
  const [onboardCurrentBal, setOnboardCurrentBal] = useState("");
  const [onboardStep, setOnboardStep] = useState(1);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [allYearData, setAllYearData] = useState(() => loadData("yearData", { [CURRENT_YEAR]: defaultYearData() }));

  // Auto-save whenever data changes
  const saveData = (key, value) => {
    try { localStorage.setItem("sakuhin_" + key, JSON.stringify(value)); } catch {}
  };

  const updateBalance = (val) => { setStartingBalance(val); saveData("balance", val); };
  const updateYearData = (updater) => {
    setAllYearData(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveData("yearData", next);
      return next;
    });
  };
  const updateBudgets = (updater) => {
    setBudgetEntries(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveData("budgets", next);
      return next;
    });
  };
  const updateGoals = (updater) => {
    setGoals(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveData("goals", next);
      return next;
    });
  };
  const updateFroggy = (updater) => {
    setFroggyBalance(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveData("froggy", next);
      return next;
    });
  };
  const addFroggyLog = (label, category, amount, month, year) => {
    setFroggyHistory(prev => {
      const next = [...prev, { id: nextId++, label, category, amount, month, year, timestamp: Date.now() }];
      saveData("froggyHistory", next);
      return next;
    });
  };
  const updateLang = (val) => { setLang(val); saveData("lang", val); };
  const toggleMode = () => { var next = mode === "dark" ? "light" : "dark"; setMode(next); saveData("mode", next); };

  const [correctionAmount, setCorrectionAmount] = useState("");
  const [correctionNote, setCorrectionNote] = useState("");

  const completeOnboarding = () => {
    saveData("balance", startingBalance);
    saveData("onboarded", true);
    setOnboarded(true);
  };

  const completeOnboardingReverse = () => {
    // Starting Balance = Current Balance - Total Earnings + Total Expenses
    const current = parseFloat(onboardCurrentBal) || 0;
    let totalEarn = 0, totalExp = 0;
    Object.values(allYearData).forEach(yd => {
      MONTHS_EN.forEach((_, i) => {
        if (yd[i]) {
          yd[i].earnings.forEach(e => { totalEarn += e.amount; });
          yd[i].expenses.forEach(e => { totalExp += e.amount; });
        }
      });
    });
    const calculated = current - totalEarn + totalExp;
    setStartingBalance(String(calculated));
    saveData("balance", String(calculated));
    saveData("onboarded", true);
    setOnboarded(true);
  };

  const addCorrection = () => {
    const amt = parseFloat(correctionAmount);
    if (!amt || amt === 0) return;
    saveSnapshot(lang === "zh" ? "余额校正" : "Balance correction");
    const todayStr = new Date().toISOString().split("T")[0];
    const dateObj = new Date(todayStr + "T00:00:00");
    const targetMonth = dateObj.getMonth();
    const targetYear = dateObj.getFullYear();
    const label = correctionNote || t.balanceCorrection;

    if (amt > 0) {
      updateYearData(prev => {
        const yd = { ...(prev[targetYear] || defaultYearData()) };
        yd[targetMonth] = { ...yd[targetMonth], earnings: [...yd[targetMonth].earnings, { id: nextId++, label, amount: amt, category: "Adjustment", date: todayStr }] };
        return { ...prev, [targetYear]: yd };
      });
    } else {
      updateYearData(prev => {
        const yd = { ...(prev[targetYear] || defaultYearData()) };
        yd[targetMonth] = { ...yd[targetMonth], expenses: [...yd[targetMonth].expenses, { id: nextId++, label, amount: Math.abs(amt), category: "Adjustment", date: todayStr }] };
        return { ...prev, [targetYear]: yd };
      });
    }
    setCorrectionAmount(""); setCorrectionNote("");
  };

  const [earnAmount, setEarnAmount] = useState("");
  const [earnLabel, setEarnLabel] = useState("");
  const [earnCategory, setEarnCategory] = useState(EARN_CATEGORIES[0]);
  const todayStr = new Date().toISOString().split("T")[0];
  const [earnDate, setEarnDate] = useState(todayStr);

  const [expAmount, setExpAmount] = useState("");
  const [expCategory, setExpCategory] = useState(EXP_CATEGORIES[0]);
  const [expLabel, setExpLabel] = useState("");
  const [expDate, setExpDate] = useState(todayStr);

  // Budgets
  const [budgetEntries, setBudgetEntries] = useState(() => loadData("budgets", []));
  const [budgetLabel, setBudgetLabel] = useState("");
  const [budgetCategory, setBudgetCategory] = useState(EXP_CATEGORIES[0]);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetScope, setBudgetScope] = useState("current"); // "current" or "all"
  const [editingBudgetId, setEditingBudgetId] = useState(null);
  const [editingBudgetAmount, setEditingBudgetAmount] = useState("");

  const addBudget = () => {
    if (!budgetAmount) return;
    saveSnapshot(t.addBudgetAction);
    const targetMonth = budgetScope === "all" ? "all" : budgetMonth;
    updateBudgets(prev => [...prev, {
      id: nextId++, label: budgetLabel || "Budget " + (prev.length + 1),
      category: budgetCategory, amount: parseFloat(budgetAmount) || 0,
      scope: targetMonth, scopeYear: selectedYear,
      // For single-month: simple lock state
      locked: false, lockedSpent: 0,
      // For all-months: per-month lock state + start/exclude
      monthState: {}, // { 0: { locked: true, lockedSpent: 50 }, ... }
      startMonth: budgetMonth, // only show from this month onwards
      excludedMonths: [], // months removed by user
    }]);
    setBudgetAmount(""); setBudgetLabel("");
  };
  const removeBudget = (id) => {
    saveSnapshot(t.removeBudgetAction);
    const entry = budgetEntries.find(b => b.id === id);
    if (entry) {
      if (entry.scope === "all") {
        const ms = entry.monthState || {};
        Object.entries(ms).forEach(([m, state]) => {
          if (state.locked) {
            const saved = Math.max(0, entry.amount - state.lockedSpent);
            if (saved > 0) {
              updateFroggy(prev => Math.max(0, prev - saved));
              addFroggyLog(entry.label, entry.category, -saved, parseInt(m), entry.scopeYear || selectedYear);
            }
          }
        });
      } else if (entry.locked) {
        const contribution = Math.max(0, entry.amount - entry.lockedSpent);
        if (contribution > 0) {
          updateFroggy(prev => Math.max(0, prev - contribution));
          addFroggyLog(entry.label, entry.category, -contribution, entry.scope !== undefined ? entry.scope : budgetMonth, entry.scopeYear || selectedYear);
        }
      }
    }
    updateBudgets(prev => prev.filter(b => b.id !== id));
  };

  const excludeBudgetFromMonth = (id, month) => {
    saveSnapshot(t.removeBudgetAction);
    const entry = budgetEntries.find(b => b.id === id);
    if (entry) {
      const ms = entry.monthState || {};
      const monthLock = ms[month] || { locked: false, lockedSpent: 0 };
      if (monthLock.locked) {
        const contribution = Math.max(0, entry.amount - monthLock.lockedSpent);
        if (contribution > 0) {
          updateFroggy(prev => Math.max(0, prev - contribution));
          addFroggyLog(entry.label, entry.category, -contribution, month, entry.scopeYear || selectedYear);
        }
      }
    }
    updateBudgets(prev => prev.map(b => {
      if (b.id !== id) return b;
      const excluded = b.excludedMonths || [];
      const newMs = { ...(b.monthState || {}) };
      delete newMs[month];
      return { ...b, excludedMonths: [...excluded, month], monthState: newMs };
    }));
  };

  const toggleLockBudget = (id) => {
    saveSnapshot(t.toggleLockAction);
    const entry = budgetEntries.find(b => b.id === id);
    if (!entry) return;

    if (entry.scope === "all") {
      // Per-month lock for all-months budgets
      const ms = entry.monthState || {};
      const currentState = ms[budgetMonth] || { locked: false, lockedSpent: 0 };

      if (currentState.locked) {
        // Unlocking this month
        const contribution = Math.max(0, entry.amount - currentState.lockedSpent);
        if (contribution > 0) {
          updateFroggy(prev => Math.max(0, prev - contribution));
          addFroggyLog(entry.label, entry.category, -contribution, budgetMonth, selectedYear);
        }
        updateBudgets(prev => prev.map(b => {
          if (b.id !== id) return b;
          const newMs = { ...(b.monthState || {}), [budgetMonth]: { locked: false, lockedSpent: 0 } };
          return { ...b, monthState: newMs };
        }));
      } else {
        // Locking this month
        const spent = spendingByCategory[entry.category] || 0;
        const leftover = Math.max(0, entry.amount - spent);
        if (leftover > 0) {
          updateFroggy(prev => prev + leftover);
          addFroggyLog(entry.label, entry.category, leftover, budgetMonth, selectedYear);
        }
        updateBudgets(prev => prev.map(b => {
          if (b.id !== id) return b;
          const newMs = { ...(b.monthState || {}), [budgetMonth]: { locked: true, lockedSpent: spent } };
          return { ...b, monthState: newMs };
        }));
      }
    } else {
      // Simple lock for single-month budgets
      if (entry.locked) {
        const contribution = Math.max(0, entry.amount - entry.lockedSpent);
        if (contribution > 0) {
          updateFroggy(prev => Math.max(0, prev - contribution));
          addFroggyLog(entry.label, entry.category, -contribution, entry.scope !== undefined ? entry.scope : budgetMonth, selectedYear);
        }
      } else {
        const spent = spendingByCategory[entry.category] || 0;
        const leftover = Math.max(0, entry.amount - spent);
        if (leftover > 0) {
          updateFroggy(prev => prev + leftover);
          addFroggyLog(entry.label, entry.category, leftover, entry.scope !== undefined ? entry.scope : budgetMonth, selectedYear);
        }
      }
      updateBudgets(prev => prev.map(b => {
        if (b.id !== id) return b;
        if (!b.locked) {
          const spent = spendingByCategory[b.category] || 0;
          return { ...b, locked: true, lockedSpent: spent };
        } else {
          return { ...b, locked: false, lockedSpent: 0 };
        }
      }));
    }
  };
  const saveEditBudget = (id) => {
    saveSnapshot(t.editBudgetAction);
    updateBudgets(prev => prev.map(b => b.id === id ? { ...b, amount: parseFloat(editingBudgetAmount) || 0 } : b));
    setEditingBudgetId(null); setEditingBudgetAmount("");
  };

  // Goals
  const [goals, setGoals] = useState(() => loadData("goals", []));
  const [goalName, setGoalName] = useState("");
  const [goalValue, setGoalValue] = useState("");
  const [goalImage, setGoalImage] = useState("");
  const [goalImageType, setGoalImageType] = useState("preset"); // "preset" | "emoji" | "url"
  const [autoMatched, setAutoMatched] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSource, setAiSource] = useState(""); // "keyword" | "ai"
  const [showGoalForm, setShowGoalForm] = useState(false);

  const GOAL_PRESETS = [
    { emoji: "🚗", label: "Car" },
    { emoji: "🏠", label: "House" },
    { emoji: "💻", label: "Laptop" },
    { emoji: "📱", label: "Phone" },
    { emoji: "✈️", label: "Travel" },
    { emoji: "🎓", label: "Education" },
    { emoji: "👗", label: "Clothing" },
    { emoji: "🎮", label: "Gaming" },
    { emoji: "💍", label: "Jewelry" },
    { emoji: "🏋️", label: "Fitness" },
    { emoji: "🎸", label: "Music" },
    { emoji: "📷", label: "Camera" },
    { emoji: "🛋️", label: "Furniture" },
    { emoji: "🎟️", label: "Tickets" },
    { emoji: "⌚", label: "Watch" },
    { emoji: "🎁", label: "Gift" },
    { emoji: "🏍️", label: "Motorcycle" },
    { emoji: "💰", label: "Savings" },
    { emoji: "🐶", label: "Pet" },
    { emoji: "🔧", label: "Tools" },
  ];

  // Keyword → emoji mapping for auto-match
  const KEYWORD_MAP = [
    { keywords: ["car","tesla","bmw","audi","mercedes","toyota","honda","ford","vehicle","sedan","suv","truck","pickup","civic","camry","mustang","porsche","lambo","lamborghini","ferrari","corvette","jeep","lexus","hyundai","kia","mazda","subaru","nissan","chevy","chevrolet","volkswagen","vw","dodge","chrysler","acura","infiniti","volvo","jaguar","maserati","bentley","rolls","royce","aston","martin","bugatti","mclaren"], emoji: "🚗" },
    { keywords: ["motorcycle","motorbike","harley","ducati","yamaha","kawasaki","suzuki","bike","scooter","vespa"], emoji: "🏍️" },
    { keywords: ["house","home","apartment","condo","flat","mortgage","down payment","property","real estate","rent","townhouse","mansion","villa"], emoji: "🏠" },
    { keywords: ["laptop","computer","macbook","pc","desktop","imac","chromebook","thinkpad","surface","dell","lenovo","asus","acer","razer"], emoji: "💻" },
    { keywords: ["phone","iphone","samsung","pixel","galaxy","android","smartphone","mobile","ipad","tablet","airpods","earbuds","headphones"], emoji: "📱" },
    { keywords: ["travel","trip","vacation","holiday","flight","cruise","resort","hotel","airbnb","backpack","passport","beach","island","europe","asia","japan","paris","london","bali","hawaii","mexico","caribbean","disney","disneyland","disneyworld"], emoji: "✈️" },
    { keywords: ["school","college","university","tuition","course","degree","masters","mba","bootcamp","certification","class","education","textbook","student","study","training"], emoji: "🎓" },
    { keywords: ["clothes","clothing","dress","suit","jacket","coat","hoodie","sneakers","shoes","boots","nike","adidas","jordan","yeezy","puma","vans","converse","gucci","prada","louis vuitton","balenciaga","zara","fashion","outfit","uniform","jersey"], emoji: "👗" },
    { keywords: ["game","gaming","playstation","ps5","ps4","xbox","nintendo","switch","steam","deck","console","controller","vr","oculus","quest","pc gaming","gpu","graphics card","rtx","rig"], emoji: "🎮" },
    { keywords: ["ring","necklace","bracelet","earring","jewelry","jewellery","diamond","gold","silver","pendant","chain","engagement","wedding band","rolex","cartier","tiffany"], emoji: "💍" },
    { keywords: ["gym","fitness","workout","treadmill","weights","dumbbell","peloton","exercise","crossfit","yoga","mat","bench","barbell","kettlebell","protein","supplement"], emoji: "🏋️" },
    { keywords: ["guitar","piano","drum","music","instrument","violin","bass","ukulele","keyboard","speaker","amp","amplifier","microphone","mic","headphone","studio","dj","turntable","saxophone","flute","trumpet"], emoji: "🎸" },
    { keywords: ["camera","photography","dslr","mirrorless","canon","nikon","sony","fuji","gopro","drone","lens","tripod","photo"], emoji: "📷" },
    { keywords: ["furniture","couch","sofa","desk","chair","table","bed","mattress","shelf","bookshelf","dresser","cabinet","ikea","wardrobe","nightstand","ottoman","recliner"], emoji: "🛋️" },
    { keywords: ["ticket","concert","show","festival","event","game ticket","movie","premiere","pass","vip","broadway","theater","theatre","match","season pass","f1","formula"], emoji: "🎟️" },
    { keywords: ["watch","apple watch","smartwatch","fitbit","garmin","rolex","omega","seiko","casio","tag heuer","chronograph","timepiece"], emoji: "⌚" },
    { keywords: ["gift","present","surprise","birthday gift","christmas gift","anniversary"], emoji: "🎁" },
    { keywords: ["save","saving","savings","emergency fund","rainy day","nest egg","retirement","401k","ira","investment","stock","crypto","bitcoin","ethereum"], emoji: "💰" },
    { keywords: ["dog","puppy","golden retriever","labrador","bulldog","poodle","husky","corgi","beagle","rottweiler","pitbull","german shepherd","doberman"], emoji: "🐶" },
    { keywords: ["cat","kitten","persian","siamese","tabby","bengal","ragdoll","maine coon","sphynx"], emoji: "🐱" },
    { keywords: ["pet","aquarium","fish","bird","hamster","rabbit","bunny","parrot","turtle","reptile","terrarium","veterinary","vet","guinea pig"], emoji: "🐾" },
    { keywords: ["tool","tools","drill","saw","wrench","hammer","workshop","garage","renovation","repair","lawnmower","mower","garden","chainsaw","workbench"], emoji: "🔧" },
    { keywords: ["tv","television","monitor","screen","oled","qled","projector","home theater","home theatre","soundbar","roku","fire stick"], emoji: "📺" },
    { keywords: ["bicycle","cycling","trek","specialized","road bike","mountain bike","e-bike","ebike"], emoji: "🚲" },
    { keywords: ["book","books","kindle","e-reader","reading","novel","library","bookshelf collection"], emoji: "📚" },
    { keywords: ["coffee","espresso","latte","cafe","barista","nespresso","breville","coffee machine","grinder"], emoji: "☕" },
    { keywords: ["kitchen","oven","stove","refrigerator","fridge","blender","mixer","cookware","dishwasher","microwave","air fryer","instant pot","food processor"], emoji: "🍳" },
    { keywords: ["baby","nursery","stroller","crib","car seat","infant","newborn","maternity","pregnancy"], emoji: "👶" },
    { keywords: ["wedding","honeymoon","engagement","bridal","groom","ceremony","reception"], emoji: "💒" },
    { keywords: ["boat","yacht","kayak","canoe","jet ski","sailing","marine","fishing boat","pontoon"], emoji: "⛵" },
    { keywords: ["ski","snowboard","skiing","snowboarding","winter sport","snow gear","slopes","lift pass"], emoji: "⛷️" },
    { keywords: ["camp","camping","tent","rv","camper","hiking","backpacking","outdoors","sleeping bag","trail"], emoji: "⛺" },
    { keywords: ["dental","braces","invisalign","teeth","dentist","orthodontic","whitening","implant"], emoji: "🦷" },
    { keywords: ["glasses","sunglasses","contacts","eyewear","frames","prescription","ray-ban","oakley"], emoji: "🕶️" },
    { keywords: ["tattoo","piercing","body art","ink"], emoji: "🎨" },
    { keywords: ["moving","relocation","new city","apartment deposit","security deposit","first month","last month"], emoji: "📦" },
  ];

  const autoMatchEmoji = (name) => {
    const lower = name.toLowerCase();
    for (const entry of KEYWORD_MAP) {
      for (const kw of entry.keywords) {
        if (lower.includes(kw)) return entry.emoji;
      }
    }
    return "";
  };

  const aiTimerRef = useRef(null);

  const aiMatchEmoji = async (name) => {
    const target = name || goalName;
    if (!target.trim()) return;
    setAiLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: "I need exactly ONE emoji that best represents this item someone wants to buy or save for: \"" + target.trim() + "\". Reply with ONLY the single emoji character, nothing else. No text, no explanation, no quotes - just the emoji."
          }]
        })
      });
      const data = await response.json();
      const emoji = data.content?.[0]?.text?.trim();
      if (emoji && emoji.length <= 4) {
        setGoalImage(emoji);
        setGoalImageType("emoji");
        setAutoMatched(true);
        setAiSource("ai");
      }
    } catch (err) {
      console.error("AI match error:", err);
    }
    setAiLoading(false);
  };

  const handleGoalNameChange = (val) => {
    setGoalName(val);

    // Clear any pending AI call
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);

    if (goalImageType === "preset" || autoMatched) {
      const match = autoMatchEmoji(val);
      if (match) {
        // Keyword match found — use it instantly
        setGoalImage(match);
        setGoalImageType("emoji");
        setAutoMatched(true);
        setAiSource("keyword");
      } else {
        // No keyword match — clear old match and queue AI after user stops typing
        if (autoMatched) {
          setGoalImage("");
          setGoalImageType("preset");
          setAutoMatched(false);
          setAiSource("");
        }
        if (val.trim().length >= 3) {
          aiTimerRef.current = setTimeout(() => {
            aiMatchEmoji(val);
          }, 800);
        }
      }
    }
  };

  const addGoal = () => {
    if (!goalName || !goalValue) return;
    saveSnapshot(t.addGoalAction);
    updateGoals(prev => [...prev, { id: nextId++, name: goalName, value: parseFloat(goalValue) || 0, image: goalImage || "", imageType: goalImageType, saved: 0 }]);
    setGoalName(""); setGoalValue(""); setGoalImage(""); setGoalImageType("preset"); setAutoMatched(false); setAiSource(""); setShowGoalForm(false);
  };
  const removeGoal = (id) => { saveSnapshot(t.removeGoalAction); updateGoals(prev => prev.filter(g => g.id !== id)); };

  const [goalFundSource, setGoalFundSource] = useState({});
  const [goalWithdrawDest, setGoalWithdrawDest] = useState({});
  const [goalAddInputs, setGoalAddInputs] = useState({});
  const [goalTakeInputs, setGoalTakeInputs] = useState({});

  const getAddValidation = (goal) => {
    const amount = parseFloat(goalAddInputs[goal.id]) || 0;
    const source = goalFundSource[goal.id] || "balance";
    const spaceInGoal = goal.value - goal.saved;
    if (amount <= 0) return { valid: false, msg: "" };
    if (amount > spaceInGoal) return { valid: false, msg: lang === "zh" ? "目标只需 $" + fmt(spaceInGoal) : "Goal only needs $" + fmt(spaceInGoal) };
    if (source === "balance" && amount > availableBalance) return { valid: false, msg: lang === "zh" ? "可用余额不足 (仅有 $" + fmt(availableBalance) + ")" : "Not enough in Available Balance ($" + fmt(availableBalance) + " left)" };
    if (source === "froggy" && amount > froggyBank) return { valid: false, msg: lang === "zh" ? "青蛙银行余额不足 🐸 (仅有 $" + fmt(froggyBank) + ")" : "Froggy Bank doesn't have enough 🐸 ($" + fmt(froggyBank) + " left)" };
    return { valid: true, msg: "" };
  };

  const getTakeValidation = (goal) => {
    const amount = parseFloat(goalTakeInputs[goal.id]) || 0;
    if (amount <= 0) return { valid: false, msg: "" };
    if (amount > goal.saved) return { valid: false, msg: lang === "zh" ? "目标中只有 $" + fmt(goal.saved) : "Only $" + fmt(goal.saved) + " saved in this goal" };
    return { valid: true, msg: "" };
  };

  const addToGoal = (id) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    const v = getAddValidation(goal);
    if (!v.valid) return;
    const amount = parseFloat(goalAddInputs[id]) || 0;
    const source = goalFundSource[id] || "balance";
    const spaceInGoal = goal.value - goal.saved;

    if (source === "balance") {
      saveSnapshot(t.fundGoalAction);
      const toAdd = Math.min(amount, availableBalance, spaceInGoal);
      if (toAdd <= 0) return;
      updateGoals(prev => prev.map(g => g.id === id ? { ...g, saved: g.saved + toAdd } : g));
    } else {
      saveSnapshot(t.froggyTransferAction);
      const toAdd = Math.min(amount, froggyBank, spaceInGoal);
      if (toAdd <= 0) return;
      updateGoals(prev => prev.map(g => g.id === id ? { ...g, saved: g.saved + toAdd } : g));
      updateFroggy(prev => Math.max(0, prev - toAdd));
      addFroggyLog(goal.name, "Goal", -toAdd, budgetMonth, selectedYear);
    }
    setGoalAddInputs(prev => ({ ...prev, [id]: "" }));
  };

  const withdrawFromGoal = (id) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    const v = getTakeValidation(goal);
    if (!v.valid) return;
    const amount = parseFloat(goalTakeInputs[id]) || 0;
    const dest = goalWithdrawDest[id] || "balance";
    const toTake = Math.min(amount, goal.saved);
    if (toTake <= 0) return;
    saveSnapshot(t.withdrawGoalAction);
    updateGoals(prev => prev.map(g => g.id === id ? { ...g, saved: Math.max(0, g.saved - toTake) } : g));
    if (dest === "froggy") {
      updateFroggy(prev => prev + toTake);
      addFroggyLog(goal.name, "Goal", toTake, budgetMonth, selectedYear);
    }
    setGoalTakeInputs(prev => ({ ...prev, [id]: "" }));
  };

  const handleYearChange = (val) => {
    const num = parseInt(val);
    if (!isNaN(num) && num > 0) { setSelectedYear(num); updateYearData(prev => prev[num] ? prev : { ...prev, [num]: defaultYearData() }); }
    else if (val === "") setSelectedYear("");
  };

  const yearData = allYearData[selectedYear] || defaultYearData();
  const isAll = selectedMonth === "all";
  const tableMonth = isAll ? null : selectedMonth;

  const currentBalance = useMemo(() => {
    const start = parseFloat(startingBalance) || 0;
    let totalEarn = 0, totalExp = 0;
    // Sum across ALL years, not just the selected year
    Object.values(allYearData).forEach(yd => {
      MONTHS_EN.forEach((_, i) => {
        if (yd[i]) {
          yd[i].earnings.forEach(e => { totalEarn += e.amount; });
          yd[i].expenses.forEach(e => { totalExp += e.amount; });
        }
      });
    });
    return start + totalEarn - totalExp;
  }, [startingBalance, allYearData]);

  const [froggyBalance, setFroggyBalance] = useState(() => loadData("froggy", 0));
  const [froggyHistory, setFroggyHistory] = useState(() => loadData("froggyHistory", []));
  const [froggyHistoryMonth, setFroggyHistoryMonth] = useState(new Date().getMonth());
  const [froggyHistoryYear, setFroggyHistoryYear] = useState(CURRENT_YEAR);
  const [showFroggyHistory, setShowFroggyHistory] = useState(false);

  const froggyBank = Math.max(0, froggyBalance);

  const totalAllocated = useMemo(() => goals.reduce((s, g) => s + g.saved, 0) + froggyBank, [goals, froggyBank]);
  const availableBalance = currentBalance - totalAllocated;

  const currentTableData = useMemo(() => {
    if (tableMonth !== null) return yearData[tableMonth];
    const combined = { earnings: [], expenses: [] };
    MONTHS_EN.forEach((_, i) => {
      yearData[i].earnings.forEach(e => combined.earnings.push({ ...e, month: MONTHS[i] }));
      yearData[i].expenses.forEach(e => combined.expenses.push({ ...e, month: MONTHS[i] }));
    });
    return combined;
  }, [yearData, tableMonth]);

  // ─── UNDO SYSTEM ───
  const [undoStack, setUndoStack] = useState([]);
  const [undoMessage, setUndoMessage] = useState("");
  const undoTimerRef = useRef(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const resetAll = () => {
    setStartingBalance(""); setEditingBalance(false); setOnboarded(false);
    setAllYearData({ [CURRENT_YEAR]: defaultYearData() });
    setBudgetEntries([]); setGoals([]); setFroggyBalance(0); setFroggyHistory([]);
    setUndoStack([]);
    saveData("balance", ""); saveData("onboarded", false); saveData("yearData", { [CURRENT_YEAR]: defaultYearData() });
    saveData("budgets", []); saveData("goals", []); saveData("froggy", 0); saveData("froggyHistory", []);
    setShowResetConfirm(false);
    setUndoMessage(lang === "zh" ? "已重置所有数据" : "All data has been reset");
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => setUndoMessage(""), 2500);
  };

  const saveSnapshot = (label) => {
    setUndoStack(prev => {
      const snapshot = {
        label,
        startingBalance,
        allYearData: JSON.parse(JSON.stringify(allYearData)),
        budgetEntries: JSON.parse(JSON.stringify(budgetEntries)),
        goals: JSON.parse(JSON.stringify(goals)),
        froggyBalance,
        froggyHistory: JSON.parse(JSON.stringify(froggyHistory)),
      };
      const next = [...prev, snapshot];
      return next.length > MAX_UNDO ? next.slice(next.length - MAX_UNDO) : next;
    });
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setStartingBalance(last.startingBalance);
    setAllYearData(last.allYearData);
    setBudgetEntries(last.budgetEntries);
    setGoals(last.goals);
    setFroggyBalance(last.froggyBalance);
    setFroggyHistory(last.froggyHistory || []);
    saveData("balance", last.startingBalance);
    saveData("yearData", last.allYearData);
    saveData("budgets", last.budgetEntries);
    saveData("goals", last.goals);
    saveData("froggy", last.froggyBalance);
    saveData("froggyHistory", last.froggyHistory || []);
    setUndoStack(prev => prev.slice(0, -1));
    setUndoMessage(t.undid + ": " + last.label);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => setUndoMessage(""), 2500);
  };

  const addEarning = () => {
    if (!earnAmount) return;
    saveSnapshot(t.addEarningAction);
    const dateObj = new Date(earnDate + "T00:00:00");
    const targetMonth = dateObj.getMonth();
    const targetYear = dateObj.getFullYear();
    updateYearData(prev => {
      const yd = { ...(prev[targetYear] || defaultYearData()) };
      yd[targetMonth] = { ...yd[targetMonth], earnings: [...yd[targetMonth].earnings, { id: nextId++, label: earnLabel || "Earning " + (yd[targetMonth].earnings.length + 1), amount: parseFloat(earnAmount) || 0, category: earnCategory, date: earnDate }] };
      return { ...prev, [targetYear]: yd };
    });
    if (targetYear !== selectedYear) setSelectedYear(targetYear);
    setEarnAmount(""); setEarnLabel(""); setEarnDate(todayStr);
  };

  const addExpense = () => {
    if (!expAmount) return;
    saveSnapshot(t.addExpenseAction);
    const amt = parseFloat(expAmount) || 0;
    const dateObj = new Date(expDate + "T00:00:00");
    const targetMonth = dateObj.getMonth();
    const targetYear = dateObj.getFullYear();
    updateYearData(prev => {
      const yd = { ...(prev[targetYear] || defaultYearData()) };
      yd[targetMonth] = { ...yd[targetMonth], expenses: [...yd[targetMonth].expenses, { id: nextId++, label: expLabel || "Expense " + (yd[targetMonth].expenses.length + 1), amount: amt, category: expCategory, date: expDate }] };
      return { ...prev, [targetYear]: yd };
    });
    if (targetYear !== selectedYear) setSelectedYear(targetYear);
    setExpAmount(""); setExpLabel(""); setExpCategory(EXP_CATEGORIES[0]); setExpDate(todayStr);
  };

  const removeEarning = (id) => {
    saveSnapshot(t.removeEarningAction);
    updateYearData(prev => {
      const yd = { ...(prev[selectedYear] || defaultYearData()) };
      MONTHS_EN.forEach((_, i) => { if (yd[i].earnings.some(e => e.id === id)) yd[i] = { ...yd[i], earnings: yd[i].earnings.filter(e => e.id !== id) }; });
      return { ...prev, [selectedYear]: yd };
    });
  };

  const removeExpense = (id) => {
    saveSnapshot(t.removeExpenseAction);
    updateYearData(prev => {
      const yd = { ...(prev[selectedYear] || defaultYearData()) };
      MONTHS_EN.forEach((_, i) => { if (yd[i].expenses.some(e => e.id === id)) yd[i] = { ...yd[i], expenses: yd[i].expenses.filter(e => e.id !== id) }; });
      return { ...prev, [selectedYear]: yd };
    });
  };

  const totals = useMemo(() => ({
    earnings: currentTableData.earnings.reduce((s, e) => s + e.amount, 0),
    expenses: currentTableData.expenses.reduce((s, e) => s + e.amount, 0),
  }), [currentTableData]);

  // Monthly spending per category (for budget tracking)
  const budgetMonth = isAll ? new Date().getMonth() : selectedMonth;
  const budgetMonthData = yearData[budgetMonth] || { earnings: [], expenses: [] };
  const spendingByCategory = useMemo(() => {
    const spending = {};
    budgetEntries.forEach(b => {
      spending[b.category] = 0;
      budgetMonthData.expenses.forEach(e => {
        const eCat = (e.category || "Other").toLowerCase();
        if (eCat === b.category.toLowerCase()) {
          spending[b.category] += e.amount;
        }
      });
    });
    return spending;
  }, [budgetMonthData, budgetEntries]);
  const visibleBudgets = budgetEntries.filter(b => {
    const yearMatch = b.scopeYear === undefined || b.scopeYear === selectedYear;
    if (!yearMatch) return false;
    if (b.scope === "all") {
      // Only show from startMonth onwards, and not in excluded months
      const start = b.startMonth !== undefined ? b.startMonth : 0;
      if (budgetMonth < start) return false;
      const excluded = b.excludedMonths || [];
      if (excluded.includes(budgetMonth)) return false;
      return true;
    }
    return b.scope === budgetMonth || b.scope === undefined;
  });
  const totalBudget = visibleBudgets.reduce((s, b) => s + b.amount, 0);
  const totalSpentInMonth = visibleBudgets.reduce((s, b) => s + (spendingByCategory[b.category] || 0), 0);

  const fmt = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const balanceColor = currentBalance >= 0 ? "#7eb87d" : "#d4776a";

  var darkVars = ":root { --bg: #110e1a; --bg2: #1a1626; --bg3: #13101e; --bgAlt: rgba(30,26,42,0.3); --border: #2a2440; --border2: #221e34; --text: #e8e0f0; --textSub: #9890a8; --textMuted: #6b6580; --textDark: #504a60; --earn: #6adcea; --spend: #e764a3; --pos: #7eb87d; --gold: #d4b85c; --lav: #9b7ec8; --err: #d4776a; --gradBg: linear-gradient(145deg, #110e1a 0%, #1a1626 50%, #110e1a 100%); --gradAccent: linear-gradient(135deg, #e764a3, #9b7ec8); --gradBtn: linear-gradient(135deg, #2a2440, #3d3850); --gradGold: linear-gradient(135deg, #d4b85c, #e764a3); --scrollThumb: #2a2440; --btnText: #13101e; --earnBtn: #6adcea; --spendBtn: #e764a3; --gradEarn: linear-gradient(135deg, #6adcea, #9b7ec8); --gradSpend: linear-gradient(135deg, #e764a3, #fb923c); --gradScene1: linear-gradient(180deg, #0e1a20, #0a1218); --gradScene2: linear-gradient(180deg, #1a1626, #110e1a); --gradFrog: linear-gradient(180deg, #1a1626 0%, #162018 100%); --sceneBorder: #2a2440; --lavBtn: #7c6bc4; --balanceBtn: #8b7ec8; --progressWarn: linear-gradient(90deg, #fbbf24, #f59e0b); --posBtn: rgba(52,211,153,0.9); }";
  var lightVars = ":root { --bg: #f9f5f0; --bg2: #fff9f4; --bg3: #f4efe9; --bgAlt: rgba(240,220,210,0.25); --border: #e8dcd0; --border2: #f0e8de; --text: #3a2838; --textSub: #7a5a78; --textMuted: #a890a8; --textDark: #d0c0d0; --earn: #2a9da8; --spend: #d4538a; --pos: #5a9858; --gold: #b8982c; --lav: #7860a8; --err: #c85a4a; --gradBg: linear-gradient(145deg, #f9f5f0 0%, #f5ede5 50%, #f9f5f0 100%); --gradAccent: linear-gradient(135deg, #e764a3, #c87ec8); --gradBtn: linear-gradient(135deg, #f5ede5, #ecddd0); --gradGold: linear-gradient(135deg, #c8a040, #d4538a); --scrollThumb: #ddd0c4; --btnText: #fff9f4; --earnBtn: #2a9da8; --spendBtn: #d4538a; --gradEarn: linear-gradient(135deg, #2a9da8, #7860a8); --gradSpend: linear-gradient(135deg, #d4538a, #e8946a); --gradScene1: linear-gradient(180deg, #eaf5f4, #d8ece8); --gradScene2: linear-gradient(180deg, #f5eaee, #fce8f0); --gradFrog: linear-gradient(180deg, #eef5ee 0%, #e0ede0 100%); --sceneBorder: #e0d4c8; --lavBtn: #7860a8; --balanceBtn: #9870b8; --progressWarn: linear-gradient(90deg, #d4a830, #c89828); --posBtn: rgba(90,152,88,0.9); }";
  var themeVars = mode === "dark" ? darkVars : lightVars;
  const mainCSS = [
    themeVars,
    "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');",
    "* { box-sizing: border-box; }",
    "html, body, #root { overflow-x: hidden; width: 100%; }",
    "input, select { outline: none; max-width: 100%; }",
    "input:focus, select:focus { border-color: var(--spend) !important; box-shadow: 0 0 0 2px rgba(231,100,163,0.15); }",
    "table { border-collapse: collapse; }",
    "td, th { vertical-align: middle; line-height: 1.4; }",
    "td span { vertical-align: middle; display: inline-block; }",
    "table td, table th { white-space: nowrap; }",
    "table td.status-cell { white-space: normal; }",
    "@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }",
    "@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }",
    "@keyframes breathe { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }",
    "::selection { background: rgba(231,100,163,0.25); }",
    "::-webkit-scrollbar { width: 6px; }",
    "::-webkit-scrollbar-track { background: transparent; }",
    "::-webkit-scrollbar-thumb { background: var(--scrollThumb); border-radius: 3px; }",
    "@media (max-width: 600px) { .mobile-stack { flex-direction: column !important; } .mobile-full { flex: 1 1 100% !important; max-width: 100% !important; min-width: 0 !important; width: 100% !important; } }"
  ].join(" ");

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Noto Sans JP', 'Segoe UI', sans-serif", background: "var(--gradBg)", color: "var(--text)", padding: "24px 16px", overflowX: "hidden" }}>
      <style>{mainCSS}</style>

      {/* ─── ONBOARDING ─── */}
      {!onboarded ? (
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "40px 0" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--gradAccent)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "var(--btnText)", marginBottom: 14 }}>作</div>
            <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>{t.onboardTitle}</h1>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 8 }}>
              <button onClick={toggleMode} style={{
                padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                background: "var(--gradBtn)", color: "var(--spend)",
                fontSize: 11, fontWeight: 600,
              }}>{mode === "dark" ? "🌸 Kanmei" : "🌙 Akana"}</button>
              <button onClick={() => updateLang(lang === "en" ? "zh" : "en")} style={{
                padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                background: "var(--gradGold)", color: "#fff",
                fontSize: 11, fontWeight: 700,
              }}>{lang === "en" ? "中文" : "EN"}</button>
            </div>
          </div>

          {/* Mode selector */}
          {!onboardMode && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button onClick={() => setOnboardMode("starting")} style={{
                padding: 20, borderRadius: 14, border: "2px solid var(--border)", cursor: "pointer",
                background: "var(--bg2)", textAlign: "left",
              }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>💰 {t.iKnowStarting}</div>
                <div style={{ fontSize: 12, color: "var(--textSub)" }}>{t.onboardStep1Hint}</div>
              </button>
              <button onClick={() => setOnboardMode("current")} style={{
                padding: 20, borderRadius: 14, border: "2px solid var(--border)", cursor: "pointer",
                background: "var(--bg2)", textAlign: "left",
              }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>📱 {t.iKnowCurrent}</div>
                <div style={{ fontSize: 12, color: "var(--textSub)" }}>{t.currentBalanceHint}</div>
              </button>
            </div>
          )}

          {/* PATH A: I know my starting balance */}
          {onboardMode === "starting" && (
            <div>
              <button onClick={() => setOnboardMode(null)} style={{ background: "none", border: "none", color: "var(--textMuted)", cursor: "pointer", fontSize: 12, marginBottom: 12, padding: 0 }}>← {t.goBack}</button>
              <div style={{ padding: 20, borderRadius: 14, background: "var(--bg2)", border: "1px solid var(--border)", marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>{t.onboardStep1}</div>
                <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--textSub)", lineHeight: 1.5 }}>{t.onboardStep1Hint}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 24, fontWeight: 700, color: "var(--lav)" }}>$</span>
                  <input type="number" placeholder="0.00" value={startingBalance} onChange={e => setStartingBalance(e.target.value)}
                    style={{ flex: 1, padding: "12px 14px", borderRadius: 10, border: "2px solid rgba(139,126,200,0.4)", background: "var(--bg3)", color: "var(--text)", fontSize: 22, fontWeight: 700, fontFamily: "'Space Mono', monospace", textAlign: "center" }} />
                </div>
              </div>
              <div style={{ padding: 20, borderRadius: 14, background: "var(--bg2)", border: "1px solid var(--border)", marginBottom: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{t.onboardStep2}</div>
                <p style={{ margin: 0, fontSize: 12, color: "var(--textSub)", lineHeight: 1.5 }}>{t.onboardStep2Hint}</p>
              </div>
              {startingBalance && (
                <div style={{ padding: 16, borderRadius: 10, background: "rgba(126,184,125,0.08)", border: "1px solid rgba(126,184,125,0.2)", textAlign: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: "var(--textMuted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{t.startingBalance}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: "var(--pos)" }}>${fmt(parseFloat(startingBalance) || 0)}</div>
                </div>
              )}
              <button onClick={completeOnboarding} disabled={!startingBalance}
                style={{ width: "100%", padding: "14px 0", borderRadius: 10, border: "none", cursor: startingBalance ? "pointer" : "default", background: startingBalance ? "linear-gradient(135deg, #8b7ec8, #c9a0dc)" : "#2e2a3a", color: startingBalance ? "#14121e" : "#6b6580", fontSize: 15, fontWeight: 700, opacity: startingBalance ? 1 : 0.6 }}>
                {t.onboardStart}
              </button>
            </div>
          )}

          {/* PATH B: I only know my current balance */}
          {onboardMode === "current" && (
            <div>
              <button onClick={() => { setOnboardMode(null); setOnboardStep(1); }} style={{ background: "none", border: "none", color: "var(--textMuted)", cursor: "pointer", fontSize: 12, marginBottom: 12, padding: 0 }}>← {t.goBack}</button>

              {onboardStep === 1 && (
                <div>
                  <div style={{ padding: 20, borderRadius: 14, background: "var(--bg2)", border: "1px solid var(--border)", marginBottom: 16 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>{t.currentBalanceNow}</div>
                    <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--textSub)", lineHeight: 1.5 }}>{t.currentBalanceHint}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 24, fontWeight: 700, color: "var(--pos)" }}>$</span>
                      <input type="number" placeholder="0.00" value={onboardCurrentBal} onChange={e => setOnboardCurrentBal(e.target.value)}
                        style={{ flex: 1, padding: "12px 14px", borderRadius: 10, border: "2px solid rgba(52,211,153,0.4)", background: "var(--bg3)", color: "var(--text)", fontSize: 22, fontWeight: 700, fontFamily: "'Space Mono', monospace", textAlign: "center" }} />
                    </div>
                  </div>
                  <button onClick={() => setOnboardStep(2)} disabled={!onboardCurrentBal}
                    style={{ width: "100%", padding: "14px 0", borderRadius: 10, border: "none", cursor: onboardCurrentBal ? "pointer" : "default", background: onboardCurrentBal ? "linear-gradient(135deg, #7eb87d, #a3d4a2)" : "#2e2a3a", color: onboardCurrentBal ? "#14121e" : "#6b6580", fontSize: 15, fontWeight: 700, opacity: onboardCurrentBal ? 1 : 0.6 }}>
                    {lang === "zh" ? "下一步 →" : "Next →"}
                  </button>
                </div>
              )}

              {onboardStep === 2 && (() => {
                let tE = 0, tX = 0;
                Object.values(allYearData).forEach(yd => { MONTHS_EN.forEach((_, i) => { if (yd[i]) { yd[i].earnings.forEach(e => { tE += e.amount; }); yd[i].expenses.forEach(e => { tX += e.amount; }); } }); });
                const calculatedStart = (parseFloat(onboardCurrentBal) || 0) - tE + tX;
                return (
                  <div>
                    <div style={{ padding: 20, borderRadius: 14, background: "var(--bg2)", border: "1px solid var(--border)", marginBottom: 16 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>{t.addRecordsFirst}</div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 11, color: "var(--pos)", fontWeight: 600, marginBottom: 6 }}>↗ {t.earnings}</div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          <input type="text" placeholder={t.earningLabel} value={earnLabel} onChange={e => setEarnLabel(e.target.value)} style={{ flex: "1 1 80px", padding: "7px 8px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 11 }} />
                          <select value={earnCategory} onChange={e => setEarnCategory(e.target.value)} style={{ padding: "7px 4px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 11 }}>
                            {EARN_CATEGORIES.map(c => <option key={c} value={c}>{eCat[c] || c}</option>)}
                          </select>
                          <input type="number" placeholder="$" value={earnAmount} onChange={e => setEarnAmount(e.target.value)} style={{ width: 55, padding: "7px 6px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 11, fontFamily: "'Space Mono', monospace" }} />
                          <input type="date" value={earnDate} onChange={e => setEarnDate(e.target.value)} style={{ padding: "7px 4px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 10 }} />
                          <button onClick={addEarning} style={{ padding: "7px 10px", borderRadius: 6, border: "none", background: "var(--pos)", color: "var(--btnText)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>+</button>
                        </div>
                        {tE > 0 && <div style={{ fontSize: 10, color: "var(--pos)", marginTop: 4 }}>{t.totalEarnings}: +${fmt(tE)}</div>}
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--err)", fontWeight: 600, marginBottom: 6 }}>↘ {t.expenses}</div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          <input type="text" placeholder={t.expenseLabel} value={expLabel} onChange={e => setExpLabel(e.target.value)} style={{ flex: "1 1 80px", padding: "7px 8px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 11 }} />
                          <select value={expCategory} onChange={e => setExpCategory(e.target.value)} style={{ padding: "7px 4px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 11 }}>
                            {EXP_CATEGORIES.map(c => <option key={c} value={c}>{xCat[c] || c}</option>)}
                          </select>
                          <input type="number" placeholder="$" value={expAmount} onChange={e => setExpAmount(e.target.value)} style={{ width: 55, padding: "7px 6px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 11, fontFamily: "'Space Mono', monospace" }} />
                          <input type="date" value={expDate} onChange={e => setExpDate(e.target.value)} style={{ padding: "7px 4px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 10 }} />
                          <button onClick={addExpense} style={{ padding: "7px 10px", borderRadius: 6, border: "none", background: "var(--err)", color: "var(--btnText)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>+</button>
                        </div>
                        {tX > 0 && <div style={{ fontSize: 10, color: "var(--err)", marginTop: 4 }}>{t.totalExpenses}: -${fmt(tX)}</div>}
                      </div>
                    </div>

                    <div style={{ padding: 16, borderRadius: 10, background: "rgba(139,126,200,0.08)", border: "1px solid rgba(56,189,248,0.2)", textAlign: "center", marginBottom: 12 }}>
                      <div style={{ fontSize: 10, color: "var(--textMuted)", marginBottom: 4 }}>{t.currentBalanceNow}: ${fmt(parseFloat(onboardCurrentBal) || 0)}</div>
                      {(tE > 0 || tX > 0) && (
                        <div style={{ fontSize: 10, color: "var(--textDark)", marginBottom: 8 }}>
                          {tE > 0 && <span> − {t.earnings} ${fmt(tE)}</span>}
                          {tX > 0 && <span> + {t.expenses} ${fmt(tX)}</span>}
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: "var(--textSub)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{t.calculatedStarting}</div>
                      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: "var(--lav)" }}>${fmt(calculatedStart)}</div>
                    </div>

                    <button onClick={completeOnboardingReverse} style={{ width: "100%", padding: "14px 0", borderRadius: 10, border: "none", cursor: "pointer", background: "var(--gradAccent)", color: "var(--btnText)", fontSize: 15, fontWeight: 700 }}>
                      {t.looksGood}
                    </button>
                    <button onClick={() => setOnboardStep(1)} style={{ width: "100%", padding: "10px 0", borderRadius: 8, border: "none", cursor: "pointer", background: "transparent", color: "var(--textMuted)", fontSize: 12, marginTop: 6 }}>
                      ← {t.goBack}
                    </button>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      ) : (
      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", minWidth: 0, position: "relative" }}>
        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--gradAccent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "var(--btnText)", flexShrink: 0 }}>作</div>
              <div>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, fontFamily: "'Space Mono', monospace", letterSpacing: "-0.5px" }}>{t.moneyTracker}</h1>
                <p style={{ margin: 0, fontSize: 10, color: "var(--textMuted)" }}>{lang === "zh" ? "个人财务追踪" : "Personal Finance Tracker"} · {selectedYear} · {isAll ? t.fullYear : MONTHS[selectedMonth]}</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button onClick={toggleMode} style={{
                padding: "6px 10px", borderRadius: 6, border: "none", cursor: "pointer",
                background: "var(--gradBtn)", color: "var(--spend)",
                fontSize: 10, fontWeight: 600,
              }}>
                {mode === "dark" ? "🌸 Kanmei" : "🌙 Akana"}
              </button>
              <button onClick={() => setShowResetConfirm(true)} style={{
                padding: "6px 10px", borderRadius: 6, border: "none", cursor: "pointer",
                background: "var(--gradBtn)", color: "var(--textSub)", fontSize: 10, fontWeight: 600,
              }}>
                {lang === "zh" ? "重置" : "Reset"}
              </button>
              <button onClick={() => updateLang(lang === "en" ? "zh" : "en")} style={{
                padding: "6px 10px", borderRadius: 6, border: "none", cursor: "pointer",
                background: "var(--gradGold)", color: "#fff",
                fontSize: 10, fontWeight: 700,
              }}>
                {lang === "en" ? "中文" : "EN"}
              </button>
              {undoStack.length > 0 && (
                <button onClick={undo} style={{
                  padding: "6px 10px", borderRadius: 6,
                  border: "none", cursor: "pointer",
                  background: "var(--gradBtn)",
                  color: "var(--text)", fontSize: 11, fontWeight: 700,
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  ↩ {t.undo}
                  <span style={{
                    padding: "1px 5px", borderRadius: 4, background: "rgba(255,255,255,0.08)",
                    fontSize: 10, fontFamily: "'Space Mono', monospace",
                  }}>{undoStack.length}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reset confirmation */}
        {showResetConfirm && (
          <div style={{
            padding: 16, borderRadius: 12, marginTop: 12, marginBottom: 8,
            background: "rgba(231,100,163,0.15)", border: "1px solid rgba(196,92,92,0.3)",
            textAlign: "center",
          }}>
            <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 600, color: "#dba097" }}>
              {lang === "zh" ? "确定要重置所有数据吗？此操作无法撤销。" : "Reset all data? This cannot be undone."}
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button onClick={resetAll} style={{
                padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff",
                fontSize: 13, fontWeight: 700,
              }}>
                {lang === "zh" ? "确认重置" : "Yes, Reset All"}
              </button>
              <button onClick={() => setShowResetConfirm(false)} style={{
                padding: "8px 20px", borderRadius: 8, border: "1px solid #475569", cursor: "pointer",
                background: "transparent", color: "var(--textSub)", fontSize: 13, fontWeight: 600,
              }}>
                {lang === "zh" ? "取消" : "Cancel"}
              </button>
            </div>
          </div>
        )}

        {/* Balance */}
        <div style={{ marginTop: 20, marginBottom: 20, padding: "28px 24px", background: "linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)", borderRadius: 16, border: "1px solid " + (currentBalance >= 0 ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"), textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "var(--textSub)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
            {t.calculatedBalance}
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: balanceColor, lineHeight: 1.1, wordBreak: "break-all", marginBottom: 6 }}>
            {currentBalance < 0 ? "-" : ""}${fmt(Math.abs(currentBalance))}
          </div>

          {/* Starting balance reference */}
          <div style={{ fontSize: 10, color: "var(--textDark)", marginBottom: 14 }}>
            {t.startingBalance}: ${fmt(parseFloat(startingBalance) || 0)}
            <span style={{ fontSize: 10, color: "var(--textMuted)", cursor: "pointer", marginLeft: 6 }} onClick={() => setEditingBalance(!editingBalance)}>✎ {t.edit}</span>
          </div>
          {editingBalance && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 14, padding: "10px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--sceneBorder)" }}>
              <span style={{ fontSize: 11, color: "var(--textSub)" }}>{t.startingBalance}:</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "var(--lav)" }}>$</span>
              <input type="number" placeholder="0.00" autoFocus value={startingBalance} onChange={e => updateBalance(e.target.value)} onKeyDown={e => { if (e.key === "Enter") setEditingBalance(false); }}
                style={{ width: 140, padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(139,126,200,0.4)", background: "var(--bg3)", color: "var(--text)", fontSize: 16, fontWeight: 700, fontFamily: "'Space Mono', monospace", textAlign: "center" }} />
              <button onClick={() => setEditingBalance(false)} style={{ padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: "var(--balanceBtn)", color: "var(--btnText)", fontSize: 12, fontWeight: 700 }}>{t.set}</button>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 4, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "var(--textMuted)", textTransform: "uppercase", letterSpacing: 1 }}>{t.totalEarnings}</div>
              <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Space Mono', monospace", color: "var(--pos)", marginTop: 2 }}>+${fmt(totals.earnings)}</div>
            </div>
            <div style={{ width: 1, background: "var(--border)" }}></div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "var(--textMuted)", textTransform: "uppercase", letterSpacing: 1 }}>{t.totalExpenses}</div>
              <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Space Mono', monospace", color: "var(--err)", marginTop: 2 }}>-${fmt(totals.expenses)}</div>
            </div>
            <div style={{ width: 1, background: "var(--border)" }}></div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "var(--textMuted)", textTransform: "uppercase", letterSpacing: 1 }}>{t.net}</div>
              <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Space Mono', monospace", color: totals.earnings - totals.expenses >= 0 ? "#7eb87d" : "#d4776a", marginTop: 2 }}>
                {totals.earnings - totals.expenses >= 0 ? "+" : "-"}${fmt(Math.abs(totals.earnings - totals.expenses))}
              </div>
            </div>
          </div>
          {totalAllocated > 0 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "var(--textMuted)", textTransform: "uppercase", letterSpacing: 1 }}>{t.savedForGoals}</div>
                <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Space Mono', monospace", color: "var(--gold)", marginTop: 2 }}>${fmt(goals.reduce((s, g) => s + g.saved, 0))}</div>
              </div>
              <div style={{ width: 1, background: "var(--border)" }}></div>
              {froggyBank > 0 && <>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "var(--textMuted)", textTransform: "uppercase", letterSpacing: 1 }}>{t.froggyBankLabel}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Space Mono', monospace", color: "var(--pos)", marginTop: 2 }}>${fmt(froggyBank)}</div>
                </div>
                <div style={{ width: 1, background: "var(--border)" }}></div>
              </>}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "var(--textMuted)", textTransform: "uppercase", letterSpacing: 1 }}>{t.available}</div>
                <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Space Mono', monospace", color: availableBalance >= 0 ? "#9b7ec8" : "#d4776a", marginTop: 2 }}>${fmt(availableBalance)}</div>
              </div>
            </div>
          )}

          {/* Balance Correction */}
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
            <div style={{ fontSize: 10, color: "var(--textDark)", marginBottom: 8 }}>{t.correctionHint}</div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
              <input type="text" placeholder={lang === "zh" ? "备注（可选）" : "Note (optional)"} value={correctionNote} onChange={e => setCorrectionNote(e.target.value)}
                style={{ flex: "1 1 100px", padding: "7px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 12 }} />
              <input type="number" placeholder="+/- $" value={correctionAmount} onChange={e => setCorrectionAmount(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addCorrection(); }}
                style={{ width: 90, padding: "7px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 12, fontFamily: "'Space Mono', monospace" }} />
              <button onClick={addCorrection} disabled={!correctionAmount || parseFloat(correctionAmount) === 0}
                style={{
                  padding: "7px 14px", borderRadius: 6, border: "none", cursor: correctionAmount ? "pointer" : "default",
                  background: correctionAmount ? "linear-gradient(135deg, #c9a84c, #d4776a)" : "#2e2a3a",
                  color: correctionAmount ? "#14121e" : "#6b6580",
                  fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                  opacity: correctionAmount ? 1 : 0.5,
                }}>{t.addCorrection}</button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24, padding: 16, background: "var(--bg2)", borderRadius: 12, border: "1px solid var(--border)" }}>
          <div>
            <label style={{ fontSize: 11, color: "var(--textSub)", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>{t.enterYear}</label>
            <input type="number" placeholder="e.g. 2026" value={selectedYear} onChange={e => handleYearChange(e.target.value)}
              style={{ width: "100%", maxWidth: 160, padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 15, fontFamily: "'Space Mono', monospace" }} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: "var(--textSub)", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>{t.selectMonth}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              <button onClick={() => setSelectedMonth("all")} style={{ padding: "7px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: isAll ? 700 : 500, background: isAll ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : "#2e2a3a", color: isAll ? "#14121e" : "#9590a8" }}>{t.all}</button>
              {MONTHS.map((m, i) => (
                <button key={m} onClick={() => setSelectedMonth(i)} style={{ padding: "7px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: selectedMonth === i ? 700 : 500, background: selectedMonth === i ? "linear-gradient(135deg, #8b7ec8, #c9a0dc)" : "#2e2a3a", color: selectedMonth === i ? "#14121e" : "#9590a8" }}>{m}</button>
              ))}
            </div>
          </div>
        </div>

        {isAll && (
          <div style={{ padding: "10px 14px", borderRadius: 8, marginBottom: 16, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", fontSize: 12, color: "var(--gold)" }}>
            📌 {t.viewingAllMonths}
          </div>
        )}

        {/* ─── BUDGET CONTROL ─── */}
        <div style={{ padding: 16, borderRadius: 14, background: "var(--bg2)", border: "1px solid var(--border)", marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "var(--lav)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>◎</span> Monthly Budget
            <span style={{ fontSize: 11, fontWeight: 500, color: "var(--textMuted)" }}>— {MONTHS[budgetMonth]} {selectedYear}</span>
          </h3>

          {/* Input row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            <input placeholder={t.budgetLabel} value={budgetLabel} onChange={e => setBudgetLabel(e.target.value)}
              style={{ flex: "1 1 160px", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 13 }} />
            <select value={budgetCategory} onChange={e => setBudgetCategory(e.target.value)}
              style={{ flex: "1 1 130px", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 13 }}>
              {EXP_CATEGORIES.map(c => <option key={c} value={c}>{xCat[c] || c}</option>)}
            </select>
            <input type="number" placeholder={t.budgetLimit} value={budgetAmount} onChange={e => setBudgetAmount(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addBudget(); }}
              style={{ flex: "1 1 140px", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 13, fontFamily: "'Space Mono', monospace" }} />
            <button onClick={addBudget} style={{
              padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer",
              background: "var(--gradAccent)", color: "var(--btnText)", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap",
            }}>{t.setBtn}</button>
          </div>
          {/* Scope toggle */}
          <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
            <button onClick={() => setBudgetScope("current")} style={{
              padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: budgetScope === "current" ? 700 : 500,
              background: budgetScope === "current" ? "linear-gradient(135deg, #9b8ad4, #7c6bc4)" : "#2e2a3a",
              color: budgetScope === "current" ? "#14121e" : "#9590a8",
            }}>{t.thisMonth} ({MONTHS[budgetMonth]})</button>
            <button onClick={() => setBudgetScope("all")} style={{
              padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: budgetScope === "all" ? 700 : 500,
              background: budgetScope === "all" ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : "#2e2a3a",
              color: budgetScope === "all" ? "#14121e" : "#9590a8",
            }}>{t.allMonthsScope}</button>
          </div>

          {/* Budget table */}
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", minWidth: 600, borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  {[t.label, t.category, t.budgetLimitCol, t.spent, t.status, ""].map((h, idx) => (
                    <th key={idx} style={{ padding: "8px 10px", textAlign: "left", color: "var(--textMuted)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleBudgets.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: 20, textAlign: "center", color: "var(--textDark)", fontStyle: "italic" }}>{t.noBudgets}</td></tr>
                ) : visibleBudgets.map((b, i) => {
                  const liveSpent = spendingByCategory[b.category] || 0;
                  // Per-month lock state for all-months budgets
                  const ms = b.scope === "all" ? ((b.monthState || {})[budgetMonth] || { locked: false, lockedSpent: 0 }) : { locked: b.locked, lockedSpent: b.lockedSpent };
                  const isLocked = ms.locked;
                  const spent = isLocked ? ms.lockedSpent : liveSpent;
                  const spentPct = b.amount > 0 ? (spent / b.amount) * 100 : 0;
                  const isOver = spent >= b.amount;
                  const isClose = spentPct >= 80 && !isOver;
                  const remaining = b.amount - spent;
                  const isEditing = editingBudgetId === b.id;

                  return (
                    <tr key={b.id + "-" + budgetMonth} style={{ borderBottom: "1px solid var(--border2)", background: i % 2 === 0 ? "transparent" : "rgba(51,65,85,0.3)", opacity: isLocked ? 0.7 : 1, transition: "opacity 0.3s ease" }}>
                      <td className="status-cell" style={{ padding: "8px 10px", fontWeight: 500, verticalAlign: "middle" }}>
                        {b.label}
                        {isLocked && <span style={{ marginLeft: 6, fontSize: 10 }}>🔒</span>}
                        <span style={{
                          marginLeft: 6, padding: "1px 6px", borderRadius: 3, fontSize: 9, fontWeight: 600,
                          background: b.scope === "all" ? "rgba(201,168,76,0.15)" : "rgba(107,90,180,0.15)",
                          color: b.scope === "all" ? "#d4b85c" : "#a8a0cc",
                        }}>{b.scope === "all" ? t.allMonthsScope : (MONTHS_EN[b.scope] !== undefined ? MONTHS[b.scope] : MONTHS[budgetMonth])} {b.scopeYear || selectedYear}</span>
                      </td>
                      <td style={{ padding: "8px 10px" }}>
                        <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "rgba(155,126,200,0.15)", color: "#c9a0dc" }}>{xCat[b.category] || b.category}</span>
                      </td>
                      <td style={{ padding: "8px 10px", fontFamily: "'Space Mono', monospace" }}>
                        {isEditing && !isLocked ? (
                          <div style={{ display: "flex", gap: 4 }}>
                            <input type="number" value={editingBudgetAmount} autoFocus
                              onChange={e => setEditingBudgetAmount(e.target.value)}
                              onKeyDown={e => { if (e.key === "Enter") saveEditBudget(b.id); if (e.key === "Escape") setEditingBudgetId(null); }}
                              style={{ width: 80, padding: "4px 6px", borderRadius: 4, border: "1px solid #a855f7", background: "var(--bg3)", color: "var(--text)", fontSize: 12, fontFamily: "'Space Mono', monospace" }} />
                            <button onClick={() => saveEditBudget(b.id)} style={{ padding: "4px 8px", borderRadius: 4, border: "none", background: "var(--lavBtn)", color: "var(--btnText)", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>✓</button>
                          </div>
                        ) : (
                          <span onClick={() => { if (!isLocked) { setEditingBudgetId(b.id); setEditingBudgetAmount(String(b.amount)); } }}
                            style={{ cursor: isLocked ? "default" : "pointer", color: "var(--lav)", borderBottom: isLocked ? "none" : "1px dashed #7c3aed" }}
                            title={isLocked ? t.unlockToEdit : t.clickToEdit}>
                            ${fmt(b.amount)}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "8px 10px", fontFamily: "'Space Mono', monospace", color: isOver ? "#d4776a" : "#9590a8", whiteSpace: "nowrap" }}>
                        ${fmt(spent)}
                      </td>
                      <td className="status-cell" style={{ padding: "8px 10px", minWidth: 160 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 9, color: "var(--textMuted)" }}>${fmt(spent)} {t.of} ${fmt(b.amount)} {t.spentWord}</span>
                          <span style={{ fontSize: 9, color: isOver ? "#d4776a" : "#7eb87d" }}>
                            {isOver ? t.over + " $" + fmt(Math.abs(remaining)) : t.remaining + " $" + fmt(remaining)}
                          </span>
                        </div>
                        <div style={{ width: "100%", height: 6, borderRadius: 3, background: "var(--bg3)", overflow: "hidden", marginBottom: 4 }}>
                          <div style={{ width: Math.min(100, spentPct) + "%", height: "100%", borderRadius: 3,
                            background: isOver ? "linear-gradient(90deg, #c45c5c, #d4776a)" : isClose ? "linear-gradient(90deg, #c9a84c, #d4b85c)" : "linear-gradient(90deg, #7c6bc4, #9b8ad4)",
                            transition: "width 0.6s ease",
                          }}/>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 9, color: isOver ? "#d4776a" : "#504a60" }}>
                            {spentPct.toFixed(0)}% {t.ofBudgetLimit}
                          </span>
                          {isLocked && <span style={{ fontSize: 9, color: "var(--gold)", fontWeight: 600 }}>{t.locked}</span>}
                        </div>
                      </td>
                      <td style={{ padding: "8px 10px" }}>
                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                          <button onClick={() => toggleLockBudget(b.id)}
                            title={isLocked ? t.unlockResume : t.lockStop}
                            style={{ background: "none", border: "none", color: isLocked ? "#d4b85c" : "#6b6580", cursor: "pointer", fontSize: 14 }}>
                            {isLocked ? "🔒" : "🔓"}
                          </button>
                          {b.scope === "all" ? (
                            <button onClick={() => excludeBudgetFromMonth(b.id, budgetMonth)}
                              title={lang === "zh" ? "从本月移除" : "Remove from this month"}
                              style={{ background: "none", border: "none", color: "var(--textMuted)", cursor: "pointer", fontSize: 16 }}>×</button>
                          ) : (
                            <button onClick={() => removeBudget(b.id)} style={{ background: "none", border: "none", color: "var(--textMuted)", cursor: "pointer", fontSize: 16 }}>×</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {visibleBudgets.length > 0 && (
                  <tr style={{ borderTop: "2px solid var(--border)", fontWeight: 700 }}>
                    <td style={{ padding: "10px 10px" }}>{t.total}</td>
                    <td></td>
                    <td style={{ padding: "10px 10px", fontFamily: "'Space Mono', monospace", color: "var(--lav)" }}>${fmt(totalBudget)}</td>
                    <td style={{ padding: "10px 10px", fontFamily: "'Space Mono', monospace", color: totalSpentInMonth > totalBudget ? "#d4776a" : "#9590a8" }}>${fmt(totalSpentInMonth)}</td>
                    <td style={{ padding: "10px 10px" }}>
                      <span style={{
                        padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                        background: totalSpentInMonth > totalBudget ? "rgba(231,100,163,0.15)" : "rgba(126,184,125,0.15)",
                        color: totalSpentInMonth > totalBudget ? "#e764a3" : "#7eb87d",
                      }}>
                        {totalSpentInMonth > totalBudget ? t.overBudget : t.onTrack}
                      </span>
                    </td>
                    <td></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visual Scenes */}
        <FinancialScene type="earning" data={currentTableData.earnings} categories={EARN_CATEGORIES} Icons={EarnIcons} t={t} catNames={eCat} mode={mode} />
        <FinancialScene type="expense" data={currentTableData.expenses} categories={EXP_CATEGORIES} Icons={ExpIcons} t={t} catNames={xCat} mode={mode} />

        {/* ─── GOALS & FROGGY BANK ─── */}
        <div className="mobile-stack" style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 20, alignItems: "start" }}>

        {/* ─── GOALS SECTION ─── */}
        <div className="mobile-full" style={{ padding: 20, borderRadius: 14, background: "var(--bg2)", border: "1px solid var(--border)", flex: "1 1 400px", minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "var(--gold)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>★</span> {t.goals}
            </h3>
            <button onClick={() => setShowGoalForm(!showGoalForm)} style={{
              padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              background: showGoalForm ? "#2e2a3a" : "linear-gradient(135deg, #fbbf24, #f59e0b)",
              color: showGoalForm ? "#9590a8" : "#14121e", fontSize: 13, fontWeight: 700,
            }}>{showGoalForm ? t.cancel : t.addGoal}</button>
          </div>

          {/* Add Goal Form */}
          {showGoalForm && (
            <div style={{
              padding: 16, borderRadius: 10, background: "var(--bg3)", border: "1px solid var(--border)", marginBottom: 16,
            }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                <input placeholder={t.goalName} value={goalName} onChange={e => handleGoalNameChange(e.target.value)}
                  style={{ flex: "1 1 200px", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontSize: 13 }} />
                <input type="number" placeholder={t.targetPrice} value={goalValue} onChange={e => setGoalValue(e.target.value)}
                  style={{ flex: "1 1 140px", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontSize: 13, fontFamily: "'Space Mono', monospace" }} />
              </div>

              {/* Image picker tabs */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, color: "var(--textSub)", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>{t.chooseIcon}</label>
                <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                  {[
                    { key: "preset", label: t.pickIcon },
                    { key: "emoji", label: t.typeEmoji },
                    { key: "upload", label: t.uploadPhoto },
                  ].map(tab => (
                    <button key={tab.key} onClick={() => { setGoalImageType(tab.key); setGoalImage(""); setAutoMatched(false); setAiSource(""); }}
                      style={{
                        padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
                        fontSize: 11, fontWeight: goalImageType === tab.key ? 700 : 500,
                        background: goalImageType === tab.key ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : "#2e2a3a",
                        color: goalImageType === tab.key ? "#14121e" : "#9590a8",
                      }}>{tab.label}</button>
                  ))}
                </div>

                {/* Preset grid */}
                {goalImageType === "preset" && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {GOAL_PRESETS.map(p => (
                      <button key={p.label} onClick={() => { setGoalImage(p.emoji); setAutoMatched(false); setAiSource(""); }}
                        style={{
                          width: 56, height: 56, borderRadius: 10, border: goalImage === p.emoji ? "2px solid #fbbf24" : "1px solid var(--sceneBorder)",
                          background: goalImage === p.emoji ? "rgba(251,191,36,0.1)" : "#1f1c2a",
                          cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                          transition: "all 0.15s",
                        }}>
                        <span style={{ fontSize: 22 }}>{p.emoji}</span>
                        <span style={{ fontSize: 8, color: goalImage === p.emoji ? "#d4b85c" : "#6b6580" }}>{p.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Emoji input */}
                {goalImageType === "emoji" && (
                  <div>
                    <input placeholder={t.emojiPlaceholder} value={goalImage} onChange={e => { setGoalImage(e.target.value); setAutoMatched(false); setAiSource(""); }}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontSize: 20, textAlign: "center" }} />
                    <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--textMuted)" }}>
                      {t.emojiHint}
                    </p>
                  </div>
                )}

                {/* Upload photo */}
                {goalImageType === "upload" && (
                  <div>
                    <label style={{
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      padding: "24px 16px", borderRadius: 10, border: "2px dashed #2e2a3a",
                      background: goalImage ? "transparent" : "#1c1b28", cursor: "pointer",
                      transition: "border-color 0.2s ease",
                    }}
                      onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "#d4b85c"; }}
                      onDragLeave={e => { e.currentTarget.style.borderColor = "#2e2a3a"; }}
                      onDrop={e => {
                        e.preventDefault();
                        e.currentTarget.style.borderColor = "#2e2a3a";
                        const file = e.dataTransfer.files[0];
                        if (file && file.type.startsWith("image/")) {
                          const reader = new FileReader();
                          reader.onload = (ev) => { setGoalImage(ev.target.result); setAutoMatched(false); setAiSource(""); };
                          reader.readAsDataURL(file);
                        }
                      }}
                    >
                      {goalImage ? (
                        <img src={goalImage} alt="preview" style={{ maxWidth: "100%", maxHeight: 120, borderRadius: 8, objectFit: "contain" }} />
                      ) : (
                        <>
                          <span style={{ fontSize: 32, marginBottom: 8 }}>📁</span>
                          <span style={{ fontSize: 13, color: "var(--textSub)", fontWeight: 600 }}>{t.clickBrowse}</span>
                          <span style={{ fontSize: 11, color: "var(--textDark)", marginTop: 4 }}>{t.fileTypes}</span>
                        </>
                      )}
                      <input type="file" accept="image/*"
                        style={{ display: "none" }}
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => { setGoalImage(ev.target.result); setAutoMatched(false); setAiSource(""); };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {goalImage && (
                      <button onClick={() => setGoalImage("")}
                        style={{ marginTop: 8, padding: "4px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--textMuted)", fontSize: 11, cursor: "pointer" }}>
                        Remove photo
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Preview + Submit */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  {aiLoading && !goalImage && (
                    <span style={{ fontSize: 12, color: "#a8a0cc", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span> AI is picking an icon...
                    </span>
                  )}
                  {goalImage && (
                    <>
                      <span style={{ fontSize: 11, color: autoMatched ? "#d4b85c" : "#6b6580" }}>
                        {autoMatched ? (aiSource === "ai" ? "✨ AI picked:" : t.autoMatched) : "Preview:"}
                      </span>
                      {goalImageType === "url" || goalImageType === "upload" ? (
                        <img src={goalImage} alt="preview" style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover", border: "1px solid var(--border)" }} />
                      ) : (
                        <span style={{ fontSize: 28 }}>{goalImage}</span>
                      )}
                      {autoMatched && (
                        <span style={{ fontSize: 10, color: "var(--textMuted)", fontStyle: "italic" }}>
                          not right? pick below
                        </span>
                      )}
                    </>
                  )}
                  {/* Manual retry button — shows when AI failed or no match at all */}
                  {goalName.trim().length > 1 && !goalImage && !aiLoading && (
                    <button onClick={() => aiMatchEmoji(goalName)}
                      style={{
                        padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(129,140,248,0.3)",
                        background: "rgba(129,140,248,0.1)",
                        color: "#a8a0cc", fontSize: 12, fontWeight: 600, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 6,
                      }}>
                      ✨ {t.aiPickIcon}
                    </button>
                  )}
                </div>
                <button onClick={addGoal} style={{
                  padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: "var(--progressWarn)", color: "var(--btnText)", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap",
                }}>{t.addGoalBtn}</button>
              </div>
            </div>
          )}

          {/* Goal Cards */}
          {goals.length === 0 && !showGoalForm && (
            <p style={{ textAlign: "center", color: "var(--textDark)", fontStyle: "italic", fontSize: 13, padding: "20px 0" }}>
              {t.noGoals}
            </p>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: 14 }}>
            {goals.map(goal => {
              const progress = goal.value > 0 ? Math.min(100, (goal.saved / goal.value) * 100) : 0;
              const isComplete = goal.saved >= goal.value;
              const remaining = Math.max(0, goal.value - goal.saved);
              const inputVal = goalAddInputs[goal.id] || "";
              const takeVal = goalTakeInputs[goal.id] || "";
              const addV = getAddValidation(goal);
              const takeV = getTakeValidation(goal);

              return (
                <div key={goal.id} style={{
                  borderRadius: 12, overflow: "hidden",
                  background: "var(--bg3)", border: "1px solid " + (isComplete ? "rgba(52,211,153,0.4)" : "#2e2a3a"),
                  transition: "border-color 0.5s ease",
                }}>
                  {/* Image */}
                  <div style={{
                    width: "100%", height: 160, background: "#1c1b28",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden", position: "relative",
                  }}>
                    {goal.image && (goal.imageType === "url" || goal.imageType === "upload") ? (
                      <img src={goal.image} alt={goal.name}
                        style={{
                          width: "100%", height: "100%", objectFit: "cover",
                          filter: isComplete ? "none" : "grayscale(" + (100 - progress) + "%) brightness(" + (0.4 + progress * 0.006) + ")",
                          transition: "filter 0.8s ease",
                        }}
                      />
                    ) : goal.image ? (
                      <div style={{
                        fontSize: 72,
                        filter: isComplete ? "none" : "grayscale(" + (100 - progress) + "%) brightness(" + (0.5 + progress * 0.005) + ")",
                        transition: "filter 0.8s ease",
                        lineHeight: 1,
                      }}>{goal.image}</div>
                    ) : (
                      <div style={{ fontSize: 40, color: "#2e2a3a" }}>★</div>
                    )}
                    {isComplete && (
                      <div style={{
                        position: "absolute", top: 10, right: 10,
                        padding: "4px 10px", borderRadius: 6,
                        background: "var(--posBtn)", color: "var(--btnText)",
                        fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                      }}>{t.goalReached}</div>
                    )}
                    <button onClick={() => removeGoal(goal.id)} style={{
                      position: "absolute", top: 8, left: 8,
                      width: 24, height: 24, borderRadius: 6,
                      background: "rgba(0,0,0,0.5)", border: "none",
                      color: "var(--textSub)", cursor: "pointer", fontSize: 14,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>×</button>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "12px 14px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", lineHeight: 1.3, flex: 1, marginRight: 8 }}>{goal.name}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: "var(--gold)", whiteSpace: "nowrap" }}>
                        ${fmt(goal.value)}
                      </div>
                    </div>

                    {/* Saved amount */}
                    <div style={{ fontSize: 12, color: "var(--textSub)", marginBottom: 8, fontFamily: "'Space Mono', monospace" }}>
                      ${fmt(goal.saved)} <span style={{ color: "var(--textDark)" }}>saved of</span> ${fmt(goal.value)}
                    </div>

                    {/* Progress bar */}
                    <div style={{
                      width: "100%", height: 10, borderRadius: 5,
                      background: "var(--bg2)", overflow: "hidden", marginBottom: 8,
                    }}>
                      <div style={{
                        width: progress + "%", height: "100%", borderRadius: 5,
                        background: isComplete
                          ? "linear-gradient(90deg, #7eb87d, #a3d4a2)"
                          : progress > 50
                            ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                            : "linear-gradient(90deg, #f87171, #fb923c)",
                        transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.5s ease",
                      }}/>
                    </div>

                    {/* Progress info */}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: "'Space Mono', monospace", marginBottom: 10 }}>
                      <span style={{ color: isComplete ? "#7eb87d" : "#9590a8" }}>
                        {progress.toFixed(1)}%
                      </span>
                      <span style={{ color: isComplete ? "#7eb87d" : "#6b6580" }}>
                        {isComplete ? t.goalReached : t.toGo + " $" + fmt(remaining)}
                      </span>
                    </div>

                    {/* Fund controls */}
                    {!isComplete && (
                      <div>
                        {/* Source selector for adding */}
                        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                          <button onClick={() => setGoalFundSource(prev => ({ ...prev, [goal.id]: "balance" }))}
                            style={{
                              flex: 1, padding: "8px 6px", borderRadius: 8, cursor: "pointer",
                              background: (goalFundSource[goal.id] || "balance") === "balance" ? "rgba(139,126,200,0.15)" : "#14121e",
                              border: (goalFundSource[goal.id] || "balance") === "balance" ? "2px solid #38bdf8" : "1px solid var(--sceneBorder)",
                              textAlign: "center", transition: "all 0.2s ease",
                            }}>
                            <div style={{ fontSize: 14, marginBottom: 2 }}>💰</div>
                            <div style={{ fontSize: 9, fontWeight: 600, color: (goalFundSource[goal.id] || "balance") === "balance" ? "#8b7ec8" : "#6b6580" }}>{t.fromBalance}</div>
                            <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: (goalFundSource[goal.id] || "balance") === "balance" ? "#a594d4" : "#504a60", marginTop: 2 }}>
                              ${fmt(availableBalance)}
                            </div>
                          </button>
                          <button onClick={() => setGoalFundSource(prev => ({ ...prev, [goal.id]: "froggy" }))}
                            style={{
                              flex: 1, padding: "8px 6px", borderRadius: 8, cursor: froggyBank > 0 ? "pointer" : "default",
                              background: (goalFundSource[goal.id]) === "froggy" ? "rgba(163,212,162,0.15)" : "#14121e",
                              border: (goalFundSource[goal.id]) === "froggy" ? "2px solid #6ee7b7" : "1px solid var(--sceneBorder)",
                              textAlign: "center", transition: "all 0.2s ease",
                              opacity: froggyBank > 0 ? 1 : 0.4,
                            }}>
                            <div style={{ fontSize: 14, marginBottom: 2 }}>🐸</div>
                            <div style={{ fontSize: 9, fontWeight: 600, color: (goalFundSource[goal.id]) === "froggy" ? "#a3d4a2" : "#6b6580" }}>{t.fromFroggy}</div>
                            <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: (goalFundSource[goal.id]) === "froggy" ? "#7eb87d" : "#504a60", marginTop: 2 }}>
                              ${fmt(froggyBank)}
                            </div>
                          </button>
                        </div>

                        {/* Amount + Add button */}
                        <div style={{ display: "flex", gap: 6, marginBottom: goal.saved > 0 ? 8 : 0 }}>
                          <input type="number" placeholder={t.amount} value={inputVal}
                            onChange={e => setGoalAddInputs(prev => ({ ...prev, [goal.id]: e.target.value }))}
                            onKeyDown={e => { if (e.key === "Enter" && addV.valid) addToGoal(goal.id); }}
                            style={{
                              flex: 1, padding: "7px 10px", borderRadius: 6,
                              border: addV.msg ? "1px solid #f87171" : "1px solid var(--sceneBorder)",
                              background: "var(--bg2)", color: "var(--text)", fontSize: 12, fontFamily: "'Space Mono', monospace",
                            }} />
                          <button onClick={() => addToGoal(goal.id)} disabled={inputVal && !addV.valid} style={{
                            padding: "7px 14px", borderRadius: 6, border: "none",
                            cursor: (inputVal && !addV.valid) ? "not-allowed" : "pointer",
                            opacity: (inputVal && !addV.valid) ? 0.5 : 1,
                            background: (goalFundSource[goal.id] || "balance") === "froggy"
                              ? "linear-gradient(135deg, #7eb87d, #a3d4a2)"
                              : "linear-gradient(135deg, #8b7ec8, #c9a0dc)",
                            color: "var(--btnText)", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                          }}>{t.addFunds}</button>
                        </div>
                        {addV.msg && (
                          <div style={{ fontSize: 10, color: "#dba097", padding: "4px 0 6px", lineHeight: 1.3 }}>{addV.msg}</div>
                        )}

                        {/* Withdraw section */}
                        {goal.saved > 0 && (
                          <div>
                            <div style={{ fontSize: 9, color: "var(--textDark)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{t.withdraw}</div>
                            <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                              <button onClick={() => setGoalWithdrawDest(prev => ({ ...prev, [goal.id]: "balance" }))}
                                style={{
                                  flex: 1, padding: "6px 4px", borderRadius: 6, cursor: "pointer",
                                  background: (goalWithdrawDest[goal.id] || "balance") === "balance" ? "rgba(139,126,200,0.1)" : "#14121e",
                                  border: (goalWithdrawDest[goal.id] || "balance") === "balance" ? "1.5px solid #38bdf8" : "1px solid var(--sceneBorder)",
                                  textAlign: "center", transition: "all 0.2s ease",
                                }}>
                                <div style={{ fontSize: 9, fontWeight: 600, color: (goalWithdrawDest[goal.id] || "balance") === "balance" ? "#8b7ec8" : "#6b6580" }}>💰 {t.toBalance}</div>
                              </button>
                              <button onClick={() => setGoalWithdrawDest(prev => ({ ...prev, [goal.id]: "froggy" }))}
                                style={{
                                  flex: 1, padding: "6px 4px", borderRadius: 6, cursor: "pointer",
                                  background: (goalWithdrawDest[goal.id]) === "froggy" ? "rgba(163,212,162,0.1)" : "#14121e",
                                  border: (goalWithdrawDest[goal.id]) === "froggy" ? "1.5px solid #6ee7b7" : "1px solid var(--sceneBorder)",
                                  textAlign: "center", transition: "all 0.2s ease",
                                }}>
                                <div style={{ fontSize: 9, fontWeight: 600, color: (goalWithdrawDest[goal.id]) === "froggy" ? "#a3d4a2" : "#6b6580" }}>🐸 {t.toFroggy}</div>
                              </button>
                            </div>
                            <div style={{ display: "flex", gap: 6 }}>
                              <input type="number" placeholder={t.amount} value={takeVal}
                                onChange={e => setGoalTakeInputs(prev => ({ ...prev, [goal.id]: e.target.value }))}
                                style={{
                                  flex: 1, padding: "7px 10px", borderRadius: 6,
                                  border: takeV.msg ? "1px solid #f87171" : "1px solid var(--sceneBorder)",
                                  background: "var(--bg2)", color: "var(--text)", fontSize: 12, fontFamily: "'Space Mono', monospace",
                                }} />
                              <button onClick={() => withdrawFromGoal(goal.id)} disabled={takeVal && !takeV.valid} style={{
                                padding: "7px 14px", borderRadius: 6, border: "1px solid #475569",
                                cursor: (takeVal && !takeV.valid) ? "not-allowed" : "pointer",
                                background: "transparent", color: (takeVal && !takeV.valid) ? "#504a60" : "#9590a8",
                                opacity: (takeVal && !takeV.valid) ? 0.5 : 1,
                                fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
                              }}>{t.take}</button>
                            </div>
                            {takeV.msg && (
                              <div style={{ fontSize: 10, color: "#dba097", padding: "4px 0 2px", lineHeight: 1.3 }}>{takeV.msg}</div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {isComplete && (
                      <div>
                        <div style={{
                          textAlign: "center", padding: "8px 0", borderRadius: 6, marginBottom: 8,
                          background: "rgba(126,184,125,0.1)", border: "1px solid rgba(126,184,125,0.2)",
                          fontSize: 12, color: "var(--pos)", fontWeight: 600,
                        }}>
                          🎉 {t.fullyFunded}
                        </div>
                        {/* Withdraw option even when complete */}
                        <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                          <button onClick={() => setGoalWithdrawDest(prev => ({ ...prev, [goal.id]: "balance" }))}
                            style={{
                              flex: 1, padding: "6px 4px", borderRadius: 6, cursor: "pointer",
                              background: (goalWithdrawDest[goal.id] || "balance") === "balance" ? "rgba(139,126,200,0.1)" : "#14121e",
                              border: (goalWithdrawDest[goal.id] || "balance") === "balance" ? "1.5px solid #38bdf8" : "1px solid var(--sceneBorder)",
                              textAlign: "center",
                            }}>
                            <div style={{ fontSize: 9, fontWeight: 600, color: (goalWithdrawDest[goal.id] || "balance") === "balance" ? "#8b7ec8" : "#6b6580" }}>💰 {t.toBalance}</div>
                          </button>
                          <button onClick={() => setGoalWithdrawDest(prev => ({ ...prev, [goal.id]: "froggy" }))}
                            style={{
                              flex: 1, padding: "6px 4px", borderRadius: 6, cursor: "pointer",
                              background: (goalWithdrawDest[goal.id]) === "froggy" ? "rgba(163,212,162,0.1)" : "#14121e",
                              border: (goalWithdrawDest[goal.id]) === "froggy" ? "1.5px solid #6ee7b7" : "1px solid var(--sceneBorder)",
                              textAlign: "center",
                            }}>
                            <div style={{ fontSize: 9, fontWeight: 600, color: (goalWithdrawDest[goal.id]) === "froggy" ? "#a3d4a2" : "#6b6580" }}>🐸 {t.toFroggy}</div>
                          </button>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <input type="number" placeholder={t.amount} value={takeVal}
                            onChange={e => setGoalTakeInputs(prev => ({ ...prev, [goal.id]: e.target.value }))}
                            style={{
                              flex: 1, padding: "7px 10px", borderRadius: 6,
                              border: takeV.msg ? "1px solid #f87171" : "1px solid var(--sceneBorder)",
                              background: "var(--bg2)", color: "var(--text)", fontSize: 12, fontFamily: "'Space Mono', monospace",
                            }} />
                          <button onClick={() => withdrawFromGoal(goal.id)} disabled={takeVal && !takeV.valid} style={{
                            padding: "7px 14px", borderRadius: 6, border: "1px solid #475569",
                            cursor: (takeVal && !takeV.valid) ? "not-allowed" : "pointer",
                            background: "transparent", color: (takeVal && !takeV.valid) ? "#504a60" : "#9590a8",
                            opacity: (takeVal && !takeV.valid) ? 0.5 : 1,
                            fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
                          }}>{t.take}</button>
                        </div>
                        {takeV.msg && (
                          <div style={{ fontSize: 10, color: "#dba097", padding: "4px 0 2px", lineHeight: 1.3 }}>{takeV.msg}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── FROGGY BANK ─── */}
        <div className="mobile-full" style={{
          padding: 20, borderRadius: 14,
          background: "var(--gradFrog)",
          border: "1px solid " + (froggyBank > 0 ? "rgba(126,184,125,0.15)" : "#2a2440"),
          textAlign: "center",
          transition: "border-color 0.5s ease",
          flex: "0 1 280px",
        }}>
          <svg viewBox="0 0 120 100" style={{ width: 110, margin: "0 auto 12px", display: "block" }}>
            <defs>
              <radialGradient id="frog-glow"><stop offset="0%" stopColor="#7eb87d" stopOpacity="0.3"/><stop offset="100%" stopColor="#7eb87d" stopOpacity="0"/></radialGradient>
            </defs>
            {froggyBank > 0 && <circle cx="60" cy="55" r="48" fill="url(#frog-glow)"/>}
            <ellipse cx="60" cy="62" rx="32" ry="28" fill={froggyBank > 0 ? "#5a8a5a" : (mode === "dark" ? "#352f40" : "#d0c8c0")} style={{ transition: "fill 0.6s ease" }}/>
            <ellipse cx="60" cy="68" rx="22" ry="18" fill={froggyBank > 0 ? "#a3d4a2" : (mode === "dark" ? "#4a4460" : "#d8d0c8")} style={{ transition: "fill 0.6s ease" }}/>
            <circle cx="44" cy="38" r="12" fill={froggyBank > 0 ? "#6b9c6b" : (mode === "dark" ? "#4a4460" : "#c8c0b8")} style={{ transition: "fill 0.6s ease" }}/>
            <circle cx="76" cy="38" r="12" fill={froggyBank > 0 ? "#6b9c6b" : (mode === "dark" ? "#4a4460" : "#c8c0b8")} style={{ transition: "fill 0.6s ease" }}/>
            <circle cx="44" cy="36" r="7" fill={froggyBank > 0 ? "#c8dcc8" : (mode === "dark" ? "#68627a" : "#c0b8b0")} style={{ transition: "fill 0.6s ease" }}/>
            <circle cx="76" cy="36" r="7" fill={froggyBank > 0 ? "#c8dcc8" : (mode === "dark" ? "#68627a" : "#c0b8b0")} style={{ transition: "fill 0.6s ease" }}/>
            <circle cx="46" cy="35" r="3.5" fill={froggyBank > 0 ? "#2a4a2a" : (mode === "dark" ? "#352f40" : "#b8b0a8")} style={{ transition: "fill 0.6s ease" }}/>
            <circle cx="78" cy="35" r="3.5" fill={froggyBank > 0 ? "#2a4a2a" : (mode === "dark" ? "#352f40" : "#b8b0a8")} style={{ transition: "fill 0.6s ease" }}/>
            {froggyBank > 0 && <><circle cx="47" cy="33" r="1.5" fill={"#b0ccb0"} opacity="0.7"/><circle cx="79" cy="33" r="1.5" fill={"#b0ccb0"} opacity="0.7"/></>}
            {froggyBank > 0 ? (
              <path d="M48,58 Q60,68 72,58" stroke={"#4a7a4a"} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            ) : (
              <path d="M50,60 L70,60" stroke={mode === "dark" ? "#68627a" : "#c0b8b0"} strokeWidth="2" strokeLinecap="round"/>
            )}
            {froggyBank > 0 && <><circle cx="38" cy="55" r="5" fill="#7eb87d" opacity="0.3"/><circle cx="82" cy="55" r="5" fill="#7eb87d" opacity="0.3"/></>}
            <rect x="52" y="26" width="16" height="3" rx="1.5" fill={froggyBank > 0 ? "#4a7a4a" : (mode === "dark" ? "#4a4460" : "#c8c0b8")} style={{ transition: "fill 0.6s ease" }}/>
            {froggyBank > 0 && <><circle cx="52" cy="65" r="4" fill="#d4b85c" opacity="0.8"/><text x="52" y="67" textAnchor="middle" fill="#6b5020" fontSize="4" fontWeight="700">$</text></>}
            {froggyBank >= 50 && <><circle cx="62" cy="70" r="4" fill="#c9a84c" opacity="0.7"/><text x="62" y="72" textAnchor="middle" fill="#6b5020" fontSize="4" fontWeight="700">$</text></>}
            {froggyBank >= 100 && <><circle cx="68" cy="63" r="4" fill="#d4b85c" opacity="0.9"/><text x="68" y="65" textAnchor="middle" fill="#6b5020" fontSize="4" fontWeight="700">$</text></>}
            <ellipse cx="38" cy="88" rx="12" ry="5" fill={froggyBank > 0 ? "#5a8a5a" : (mode === "dark" ? "#352f40" : "#d0c8c0")} style={{ transition: "fill 0.6s ease" }}/>
            <ellipse cx="82" cy="88" rx="12" ry="5" fill={froggyBank > 0 ? "#5a8a5a" : (mode === "dark" ? "#352f40" : "#d0c8c0")} style={{ transition: "fill 0.6s ease" }}/>
          </svg>

          <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 700, color: froggyBank > 0 ? "#a3d4a2" : "#6b6580" }}>
            🐸 {t.froggyBankTitle}
          </h3>
          <p style={{ margin: "0 0 14px", fontSize: 11, color: "var(--textDark)", lineHeight: 1.4 }}>
            {t.froggyDesc}
          </p>

          <div style={{
            fontSize: 28, fontWeight: 700, fontFamily: "'Space Mono', monospace",
            color: froggyBank > 0 ? "#7eb87d" : "#504a60",
            marginBottom: 14,
            transition: "color 0.5s ease",
          }}>
            ${fmt(froggyBank)}
          </div>

          {/* Saved History */}
          <div style={{ marginTop: 12 }}>
            <button onClick={() => setShowFroggyHistory(!showFroggyHistory)} style={{
              width: "100%", padding: "8px 0", borderRadius: 8, border: "1px solid var(--border)",
              background: showFroggyHistory ? "rgba(163,212,162,0.1)" : "transparent",
              color: showFroggyHistory ? "#a3d4a2" : "#6b6580",
              fontSize: 11, fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s ease",
            }}>
              {showFroggyHistory ? t.hideHistory : t.viewHistory}
            </button>

            {showFroggyHistory && (
              <div style={{ marginTop: 10, textAlign: "left" }}>
                {/* Month/Year selectors */}
                <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                  <select value={froggyHistoryMonth} onChange={e => setFroggyHistoryMonth(parseInt(e.target.value))}
                    style={{
                      flex: 1, padding: "6px 8px", borderRadius: 6, border: "1px solid var(--border)",
                      background: "var(--bg3)", color: "var(--text)", fontSize: 11,
                    }}>
                    {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                  </select>
                  <input type="number" value={froggyHistoryYear} onChange={e => setFroggyHistoryYear(parseInt(e.target.value) || CURRENT_YEAR)}
                    style={{
                      width: 70, padding: "6px 8px", borderRadius: 6, border: "1px solid var(--border)",
                      background: "var(--bg3)", color: "var(--text)", fontSize: 11, fontFamily: "'Space Mono', monospace",
                    }} />
                </div>

                {/* Records */}
                {(() => {
                  const filtered = froggyHistory.filter(h => h.month === froggyHistoryMonth && h.year === froggyHistoryYear);
                  if (filtered.length === 0) return (
                    <p style={{ margin: 0, fontSize: 10, color: "var(--textDark)", fontStyle: "italic", textAlign: "center", padding: "8px 0" }}>
                      {t.noHistory}
                    </p>
                  );
                  return filtered.map(h => (
                    <div key={h.id || h.timestamp} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "6px 0", borderBottom: "1px solid var(--border2)",
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, color: "var(--text)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.label}</div>
                        <div style={{ fontSize: 9, color: "var(--textDark)" }}>
                          <span style={{ padding: "1px 4px", borderRadius: 3, background: "rgba(155,126,200,0.15)", color: "#c9a0dc" }}>{xCat[h.category] || eCat[h.category] || h.category}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", marginLeft: 8 }}>
                        <div style={{
                          fontSize: 12, fontFamily: "'Space Mono', monospace", fontWeight: 600,
                          color: h.amount > 0 ? "#7eb87d" : "#d4776a",
                        }}>
                          {h.amount > 0 ? "+" : ""}{h.amount < 0 ? "-" : ""}${fmt(Math.abs(h.amount))}
                        </div>
                        <div style={{ fontSize: 8, color: "var(--textDark)" }}>
                          {h.amount > 0 ? t.historyIn : t.historyOut}
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>

          {froggyBank === 0 && (
            <p style={{ margin: 0, fontSize: 10, color: "var(--textDark)", fontStyle: "italic" }}>
              {budgetEntries.length > 0 ? t.lockBudgetHint : t.setBudgetFirst}
            </p>
          )}
        </div>

        </div> {/* end goals & froggy grid */}

        {/* Earnings Table */}
        <div style={{ padding: 16, borderRadius: 12, background: "var(--bg2)", border: "1px solid var(--border)", marginBottom: 16 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "var(--pos)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>↗</span> {t.earnings} — {isAll ? selectedYear + " (" + t.allMonths + ")" : MONTHS[selectedMonth] + " " + selectedYear}
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            <input placeholder={t.earningLabel} value={earnLabel} onChange={e => setEarnLabel(e.target.value)} style={{ flex: "1 1 140px", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 13 }} />
            <select value={earnCategory} onChange={e => setEarnCategory(e.target.value)} style={{ flex: "1 1 120px", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 13 }}>
              {EARN_CATEGORIES.map(c => <option key={c} value={c}>{eCat[c] || c}</option>)}
            </select>
            <input type="number" placeholder={t.amountDollar} value={earnAmount} onChange={e => setEarnAmount(e.target.value)} style={{ flex: "1 1 120px", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 13, fontFamily: "'Space Mono', monospace" }} />
            <input type="date" value={earnDate} max={todayStr} onChange={e => setEarnDate(e.target.value)} style={{ flex: "1 1 130px", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 13, fontFamily: "'Space Mono', monospace" }} />
            <button onClick={addEarning} style={{ padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer", background: "var(--gradEarn)", color: "var(--btnText)", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>{t.add}</button>
          </div>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", minWidth: 480, borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ borderBottom: "2px solid var(--border)" }}>
                {[t.date, t.source, t.category, t.amountDollar, ""].map((h, idx) => (
                  <th key={idx} style={{ padding: "8px 10px", textAlign: "left", color: "var(--textMuted)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {currentTableData.earnings.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 20, textAlign: "center", color: "var(--textDark)", fontStyle: "italic" }}>{t.noEarnings}</td></tr>
                ) : currentTableData.earnings.map((e, i) => (
                  <tr key={e.id} style={{ borderBottom: "1px solid var(--border2)", background: i % 2 === 0 ? "transparent" : "rgba(51,65,85,0.3)" }}>
                    <td style={{ padding: "8px 10px", fontFamily: "'Space Mono', monospace", fontSize: 12, color: "var(--textSub)", verticalAlign: "middle", whiteSpace: "nowrap" }}>{e.date || "—"}</td>
                    <td style={{ padding: "8px 10px", fontWeight: 500, verticalAlign: "middle" }}>{e.label}</td>
                    <td style={{ padding: "8px 10px" }}><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "rgba(126,184,125,0.15)", color: "var(--pos)" }}>{xCat[e.category] || eCat[e.category] || e.category}</span></td>
                    <td style={{ padding: "8px 10px", fontFamily: "'Space Mono', monospace", color: "var(--pos)", whiteSpace: "nowrap" }}>+${fmt(e.amount)}</td>
                    <td style={{ padding: "8px 10px" }}><button onClick={() => removeEarning(e.id)} style={{ background: "none", border: "none", color: "var(--textMuted)", cursor: "pointer", fontSize: 16 }}>×</button></td>
                  </tr>
                ))}
                {currentTableData.earnings.length > 0 && (
                  <tr style={{ borderTop: "2px solid var(--border)", fontWeight: 700 }}>
                    <td></td><td style={{ padding: "10px 10px" }}>{t.total}</td><td></td>
                    <td style={{ padding: "10px 10px", fontFamily: "'Space Mono', monospace", color: "var(--pos)", whiteSpace: "nowrap" }}>+${fmt(totals.earnings)}</td><td></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses Table */}
        <div style={{ padding: 16, borderRadius: 12, background: "var(--bg2)", border: "1px solid var(--border)", marginBottom: 24 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "var(--err)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>↘</span> {t.expenses} — {isAll ? selectedYear + " (" + t.allMonths + ")" : MONTHS[selectedMonth] + " " + selectedYear}
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            <input placeholder={t.expenseLabel} value={expLabel} onChange={e => setExpLabel(e.target.value)} style={{ flex: "1 1 140px", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 13 }} />
            <select value={expCategory} onChange={e => setExpCategory(e.target.value)} style={{ flex: "1 1 120px", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 13 }}>
              {EXP_CATEGORIES.map(c => <option key={c} value={c}>{xCat[c] || c}</option>)}
            </select>
            <input type="number" placeholder={t.amountDollar} value={expAmount} onChange={e => setExpAmount(e.target.value)} style={{ flex: "1 1 120px", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 13, fontFamily: "'Space Mono', monospace" }} />
            <input type="date" value={expDate} max={todayStr} onChange={e => setExpDate(e.target.value)} style={{ flex: "1 1 130px", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: 13, fontFamily: "'Space Mono', monospace" }} />
            <button onClick={addExpense} style={{ padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer", background: "var(--gradSpend)", color: "var(--btnText)", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>+ Add</button>
          </div>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", minWidth: 480, borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ borderBottom: "2px solid var(--border)" }}>
                {[t.date, t.item, t.category, t.amountDollar, ""].map((h, idx) => (
                  <th key={idx} style={{ padding: "8px 10px", textAlign: "left", color: "var(--textMuted)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {currentTableData.expenses.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 20, textAlign: "center", color: "var(--textDark)", fontStyle: "italic" }}>{t.noExpenses}</td></tr>
                ) : currentTableData.expenses.map((e, i) => (
                  <tr key={e.id} style={{ borderBottom: "1px solid var(--border2)", background: i % 2 === 0 ? "transparent" : "rgba(51,65,85,0.3)" }}>
                    <td style={{ padding: "8px 10px", fontFamily: "'Space Mono', monospace", fontSize: 12, color: "var(--textSub)", verticalAlign: "middle", whiteSpace: "nowrap" }}>{e.date || "—"}</td>
                    <td style={{ padding: "8px 10px", fontWeight: 500, verticalAlign: "middle" }}>{e.label}</td>
                    <td style={{ padding: "8px 10px" }}><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "rgba(107,90,180,0.15)", color: "#a8a0cc" }}>{xCat[e.category] || eCat[e.category] || e.category}</span></td>
                    <td style={{ padding: "8px 10px", fontFamily: "'Space Mono', monospace", color: "var(--err)", whiteSpace: "nowrap" }}>-${fmt(e.amount)}</td>
                    <td style={{ padding: "8px 10px" }}><button onClick={() => removeExpense(e.id)} style={{ background: "none", border: "none", color: "var(--textMuted)", cursor: "pointer", fontSize: 16 }}>×</button></td>
                  </tr>
                ))}
                {currentTableData.expenses.length > 0 && (
                  <tr style={{ borderTop: "2px solid var(--border)", fontWeight: 700 }}>
                    <td></td><td style={{ padding: "10px 10px" }}>{t.total}</td><td></td>
                    <td style={{ padding: "10px 10px", fontFamily: "'Space Mono', monospace", color: "var(--err)", whiteSpace: "nowrap" }}>-${fmt(totals.expenses)}</td><td></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: 10, color: "var(--textDark)", paddingTop: 12, paddingBottom: 20, letterSpacing: 1 }}>
          © 2026 1XD233 · Sakuhin · 作品 · MIT License
        </div>

        {/* Undo toast */}
        {undoMessage && (
          <div style={{
            position: "sticky", bottom: 16,
            margin: "0 auto", width: "fit-content",
            padding: "10px 20px", borderRadius: 10,
            background: "var(--border)", color: "var(--text)", fontSize: 13, fontWeight: 600,
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            animation: "fadeInUp 0.3s ease",
          }}>
            ✓ {undoMessage}
          </div>
        )}
      </div>
      )}
    </div>
  );
}
