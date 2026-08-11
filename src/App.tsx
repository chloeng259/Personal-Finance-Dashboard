import { useState, type ReactNode } from 'react'
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ChartNoAxesCombined,
  Flame,
  House,
  Percent,
  PiggyBank,
  Target,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from 'lucide-react'

import {
  dummyInvestmentData,
  dummyMonthlyData,
  dummyNetWorthData,
} from './dummyData'

const currency = (value: number, decimals = 2) =>
  `$${value.toLocaleString('en-SG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`

const CHART_COLORS = [
  '#2563eb',
  '#dc2626',
  '#f59e0b',
  '#7c3aed',
  '#16a34a',
  '#0891b2',
  '#db2777',
  '#65a30d',
  '#ea580c',
  '#4f46e5',
  '#0f766e',
  '#9333ea',
  '#b91c1c',
  '#0369a1',
  '#a16207',
  '#15803d',
]

type SummaryCardProps = {
  title: string
  value: string
  subtitle: ReactNode
  icon: ReactNode
  iconClass: string
  valueClass?: string
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
  valueClass = '',
}: SummaryCardProps) {
  return (
    <div className="summary-card">
      <div className="card-heading">
        <div className={`card-icon ${iconClass}`}>
          {icon}
        </div>
        <p>{title}</p>
      </div>

      <h2 className={valueClass}>{value}</h2>
      <div className="card-subtitle">{subtitle}</div>
    </div>
  )
}

type GoalProps = {
  title: string
  current: number
  target: number
  progress: number
  icon: ReactNode
  theme: 'purple' | 'orange'
  note: string
}

function Goal({
  title,
  current,
  target,
  progress,
  icon,
  theme,
  note,
}: GoalProps) {
  return (
    <div className="goal">
      <div className="goal-heading">
        <div className="goal-title">
          <div className={`goal-icon ${theme}`}>
            {icon}
          </div>
          <strong>{title}</strong>
        </div>

        <span className={`goal-percent ${theme}`}>
          {progress.toFixed(0)}%
        </span>
      </div>

      <div className="goal-values">
        <span>{currency(current, 0)}</span>
        <span>{currency(target, 0)}</span>
      </div>

      <div className="progress-bar">
        <div
          className={`progress-fill ${theme}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="goal-note">{note}</div>
    </div>
  )
}

function MonthTick({ x, y, payload }: any) {
  const [month, year] = String(payload.value).split(' ')

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        textAnchor="middle"
        fill="#666"
        fontSize={12}
      >
        <tspan x={0} dy={22}>
          {month}
        </tspan>
        <tspan x={0} dy={16}>
          {year}
        </tspan>
      </text>
    </g>
  )
}

function App() {
  const [selectedYear, setSelectedYear] = useState(2026)

  const yearlyMonthlyData = dummyMonthlyData.filter((item) =>
    item.month.includes(String(selectedYear)),
  )

  const yearlyInvestmentData = dummyInvestmentData.filter((item) =>
    item.month.includes(String(selectedYear)),
  )

  const yearlyNetWorthData = dummyNetWorthData.filter((item) =>
    item.month.includes(String(selectedYear)),
  )

  const latestMonth = yearlyMonthlyData
    .filter((item) => item.income > 0 || item.expenses > 0)
    .at(-1)

  const latestInvestment = yearlyInvestmentData
    .filter((item) => item.currentValue > 0)
    .at(-1)

  const latestNetWorth = yearlyNetWorthData
    .filter((item) => item.netWorth > 0)
    .at(-1)

  const savings = latestMonth
    ? latestMonth.income - latestMonth.expenses
    : 0

  const savingsRate =
    latestMonth && latestMonth.income > 0
      ? (savings / latestMonth.income) * 100
      : 0

  const houseTarget = 770000 * 0.25
  const houseCurrent = latestNetWorth?.cashPlusOA ?? 0
  const houseProgress = Math.min(
    (houseCurrent / houseTarget) * 100,
    100,
  )

  const liquidTarget = 120000
  const liquidCurrent = latestNetWorth?.liquid ?? 0
  const liquidProgress = Math.min(
    (liquidCurrent / liquidTarget) * 100,
    100,
  )

  const spendingData =
    latestMonth?.categories.filter((item) => item.amount > 0) ?? []

  const monthLabel =
    latestMonth?.month ?? `No ${selectedYear} data`

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <div className="dashboard-title">
            <Flame
              size={30}
              color="#f97316"
              fill="#f97316"
            />
            <h1>Road to FAT FIRE — Demo</h1>
          </div>
          <p>{selectedYear} Overview</p>
        </div>

        <div className="year-selector">
          {[2026, 2027].map((year) => (
            <button
              key={year}
              className={selectedYear === year ? 'active' : ''}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>

        <p className="demo-label">
          Sample Data · Portfolio Project
        </p>
      </header>

      <section className="summary-grid">
        <SummaryCard
          title="Income"
          value={latestMonth ? currency(latestMonth.income) : '$0.00'}
          subtitle={monthLabel}
          icon={<TrendingUp size={18} />}
          iconClass="green"
        />

        <SummaryCard
          title="Expenses"
          value={latestMonth ? currency(latestMonth.expenses) : '$0.00'}
          subtitle={monthLabel}
          icon={<TrendingDown size={18} />}
          iconClass="red"
        />

        <SummaryCard
          title="Savings"
          value={currency(savings)}
          subtitle={monthLabel}
          icon={<PiggyBank size={18} />}
          iconClass="blue"
        />

        <SummaryCard
          title="Investments"
          value={
            latestInvestment
              ? currency(latestInvestment.currentValue)
              : '$0.00'
          }
          subtitle={
            latestInvestment ? (
              <>
                <span
                  className={
                    latestInvestment.gainPercent >= 0
                      ? 'positive'
                      : 'negative'
                  }
                >
                  {latestInvestment.gainPercent >= 0 ? '+' : ''}
                  {(latestInvestment.gainPercent * 100).toFixed(1)}% gain
                </span>
                <span className="card-month">
                  {latestInvestment.month}
                </span>
              </>
            ) : (
              `No ${selectedYear} data`
            )
          }
          icon={<ChartNoAxesCombined size={18} />}
          iconClass="purple"
        />

        <SummaryCard
          title="Net Worth"
          value={
            latestNetWorth
              ? currency(latestNetWorth.netWorth)
              : '$0.00'
          }
          subtitle={
            latestNetWorth?.month ?? `No ${selectedYear} data`
          }
          icon={<WalletCards size={18} />}
          iconClass="teal"
        />

        <SummaryCard
          title="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          subtitle={monthLabel}
          icon={<Percent size={18} />}
          iconClass="orange"
          valueClass={
            savingsRate < 20 ? 'negative' : 'positive'
          }
        />
      </section>

      <section className="dashboard-grid">
        <div className="panel large-panel">
          <h2>Monthly Cash Flow</h2>

          <div className="chart cash-flow-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={yearlyMonthlyData.filter(
                  (item) => item.income > 0 || item.expenses > 0,
                )}
                margin={{
                  top: 10,
                  right: 35,
                  bottom: 35,
                  left: 10,
                }}
              >
                <XAxis
                  dataKey="month"
                  interval={0}
                  height={64}
                  tickMargin={8}
                  tick={<MonthTick />}
                />

                <YAxis
                  tickFormatter={(value) =>
                    `$${(value / 1000).toFixed(0)}k`
                  }
                />

                <Tooltip
                  formatter={(value) =>
                    currency(Number(value))
                  }
                />

                <Legend verticalAlign="bottom" height={28} />

                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ fill: '#16a34a' }}
                  activeDot={{ r: 6 }}
                />

                <Line
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#dc2626"
                  strokeWidth={3}
                  dot={{ fill: '#dc2626' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <h2>Spending by Category</h2>

          <div className="chart spending-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart
                margin={{
                  top: 50,
                  right: 120,
                  bottom: 50,
                  left: 120,
                }}
              >
                <Pie
                  data={spendingData}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={130}
                  paddingAngle={1}
                  labelLine={false}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    outerRadius,
                    name,
                    value,
                  }: any) => {
                    const radian = Math.PI / 180
                    const radius = outerRadius + 16

                    const x =
                      cx +
                      radius *
                        Math.cos(-midAngle * radian)

                    const y =
                      cy +
                      radius *
                        Math.sin(-midAngle * radian)

                    return (
                      <text
                        x={x}
                        y={y}
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        fontSize={13}
                        fill="#333"
                      >
                        <tspan
                          x={x}
                          dy="-0.45em"
                          fontWeight={600}
                        >
                          {name}
                        </tspan>

                        <tspan x={x} dy="1.4em">
                          {currency(Number(value))}
                        </tspan>
                      </text>
                    )
                  }}
                >
                  {spendingData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        CHART_COLORS[
                          index % CHART_COLORS.length
                        ]
                      }
                    />
                  ))}
                </Pie>

                <text
                  x="50%"
                  y="48%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pie-total"
                >
                  {currency(latestMonth?.expenses ?? 0)}
                </text>

                <text
                  x="50%"
                  y="54%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pie-total-label"
                >
                  Total
                </text>

                <Tooltip
                  formatter={(value) =>
                    currency(Number(value))
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <h2>Goals</h2>

          <Goal
            title="House Downpayment"
            current={houseCurrent}
            target={houseTarget}
            progress={houseProgress}
            icon={<House size={19} />}
            theme="purple"
            note="25% of $770,000"
          />

          <Goal
            title="Liquid Asset Target"
            current={liquidCurrent}
            target={liquidTarget}
            progress={liquidProgress}
            icon={<Target size={19} />}
            theme="orange"
            note="Target by Dec 2026"
          />
        </div>

        <div className="panel large-panel">
          <h2>Investment Growth</h2>

          <div className="chart investment-chart">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={yearlyInvestmentData.filter(
                  (item) => item.currentValue > 0,
                )}
                margin={{
                  top: 20,
                  right: 35,
                  bottom: 35,
                  left: 15,
                }}
              >
                <XAxis
                  dataKey="month"
                  interval={0}
                  height={64}
                  tickMargin={8}
                  tick={<MonthTick />}
                />

                <YAxis
                  tickFormatter={(value) =>
                    `$${(value / 1000).toFixed(0)}k`
                  }
                />

                <Tooltip
                  formatter={(value, name) => [
                    currency(Number(value)),
                    name,
                  ]}
                />

                <Legend verticalAlign="bottom" height={28} />

                <Bar
                  dataKey="monthlyDeposit"
                  name="Monthly Contribution"
                  fill="#0891b2"
                  barSize={35}
                  radius={[5, 5, 0, 0]}
                />

                <Line
                  type="monotone"
                  dataKey="currentValue"
                  name="Portfolio Value"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={{
                    fill: '#7c3aed',
                    r: 4,
                  }}
                  activeDot={{ r: 6 }}
                />

                <Line
                  type="monotone"
                  dataKey="ytdContribution"
                  name="YTD Contribution"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{
                    fill: '#f59e0b',
                    r: 4,
                  }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel large-panel">
          <h2>Net Worth Composition</h2>

          <div className="chart net-worth-chart">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={yearlyNetWorthData.filter(
                  (item) =>
                    item.liquid > 0 ||
                    item.nonLiquid > 0,
                )}
                margin={{
                  top: 45,
                  right: 25,
                  bottom: 35,
                  left: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="month"
                  interval={0}
                  height={64}
                  tickMargin={8}
                  tick={<MonthTick />}
                />

                <YAxis
                  tickFormatter={(value) =>
                    `$${(value / 1000).toFixed(0)}k`
                  }
                />

                <Tooltip
                  formatter={(value, name) => [
                    currency(Number(value), 0),
                    name,
                  ]}
                />

                <Legend verticalAlign="bottom" height={28} />

                <Bar
                  dataKey="nonLiquid"
                  name="Non-Liquid Assets"
                  stackId="networth"
                  fill="#8b5cf6"
                />

                <Bar
                  dataKey="liquid"
                  name="Liquid Assets"
                  stackId="networth"
                  fill="#06b6d4"
                >
                  <LabelList
                    dataKey="netWorth"
                    position="top"
                    offset={8}
                    formatter={(value: any) =>
                      currency(Number(value), 0)
                    }
                    className="net-worth-label"
                  />
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App