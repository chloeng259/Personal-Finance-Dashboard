import { useState } from 'react'

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
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ChartNoAxesCombined,
  WalletCards,
  Percent,
  House,
  Target,
  Flame,
} from 'lucide-react'

import {
  dummyMonthlyData,
  dummyInvestmentData,
  dummyNetWorthData,
} from './dummyData'

function App() {
  const [monthlyData] = useState<any[]>(dummyMonthlyData)
  const [investmentData] = useState<any[]>(dummyInvestmentData)
  const [netWorthData] = useState<any[]>(dummyNetWorthData)
  const [selectedYear, setSelectedYear] = useState(2026)

  const MonthTick = ({
    x,
    y,
    payload,
  }: any) => {
    const [month, year] =
      String(payload.value).split(' ')

    return (
      <g
        transform={`translate(${x},${y})`}
      >
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#666"
          fontSize={12}
        >
          <tspan
            x={0}
            dy="0"
          >
            {month}
          </tspan>

          <tspan
            x={0}
            dy="1.2em"
          >
            {year}
          </tspan>
        </text>
      </g>
    )
  }

  // =========================
  // YEAR FILTERS
  // =========================

  const yearlyMonthlyData = monthlyData.filter(
    (item) =>
      String(item.month).includes(
        String(selectedYear),
      ),
  )

  const yearlyInvestmentData = investmentData.filter(
    (item) =>
      String(item.month).includes(
        String(selectedYear),
      ),
  )

  const yearlyNetWorthData = netWorthData.filter(
    (item) =>
      String(item.month).includes(
        String(selectedYear),
      ),
  )

  // =========================
  // LATEST VALUES
  // =========================

  const latestMonth = yearlyMonthlyData
    .filter(
      (item) =>
        item.income > 0 ||
        item.expenses > 0,
    )
    .at(-1)

  const latestInvestment = yearlyInvestmentData
    .filter(
      (item) =>
        item.currentValue > 0,
    )
    .at(-1)

  const latestNetWorth = yearlyNetWorthData
    .filter(
      (item) =>
        item.netWorth > 0,
    )
    .at(-1)

  const savings = latestMonth
    ? latestMonth.income -
      latestMonth.expenses
    : 0

  const savingsRate =
    latestMonth &&
    latestMonth.income > 0
      ? (savings /
          latestMonth.income) *
        100
      : 0

  const savingsRateColor =
    savingsRate < 20
      ? '#dc2626'
      : '#16a34a'

  return (
    <main className="dashboard">

      {/* HEADER */}
      <header
        className="dashboard-header"
        style={{
          display: 'grid',
          gridTemplateColumns:
            '1fr auto 1fr',
          alignItems: 'center',
          gap: 20,
        }}
      >

        {/* LEFT */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Flame
              size={30}
              color="#f97316"
              fill="#f97316"
            />

            <h1
              style={{
                margin: 0,
              }}
            >
              Road to FAT FIRE — Demo
            </h1>
          </div>

          <p>
            {selectedYear} Overview
          </p>
        </div>

        {/* MIDDLE - YEAR TOGGLE */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              backgroundColor:
                '#f1f5f9',
              padding: 4,
              borderRadius: 10,
              gap: 4,
            }}
          >
            {[2026, 2027].map(
              (year) => (
                <button
                  key={year}
                  onClick={() =>
                    setSelectedYear(
                      year,
                    )
                  }
                  style={{
                    border: 'none',
                    padding:
                      '8px 18px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600,
                    backgroundColor:
                      selectedYear ===
                      year
                        ? '#ffffff'
                        : 'transparent',
                    color:
                      selectedYear ===
                      year
                        ? '#111827'
                        : '#64748b',
                    boxShadow:
                      selectedYear ===
                      year
                        ? '0 1px 3px rgba(0,0,0,0.12)'
                        : 'none',
                  }}
                >
                  {year}
                </button>
              ),
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <p>
            Sample Data · Portfolio Project
          </p>
        </div>

      </header>

      {/* SUMMARY CARDS */}
      <section className="summary-grid">

        {/* INCOME */}
        <div className="summary-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor:
                  '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'center',
              }}
            >
              <TrendingUp
                size={18}
                color="#16a34a"
              />
            </div>

            <p
              style={{
                fontWeight: 600,
                margin: 0,
              }}
            >
              Income
            </p>
          </div>

          <h2>
            {latestMonth
              ? `$${latestMonth.income.toLocaleString(
                  'en-SG',
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}`
              : '$0.00'}
          </h2>

          <span>
            {latestMonth?.month ??
              `No ${selectedYear} data`}
          </span>
        </div>

        {/* EXPENSES */}
        <div className="summary-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor:
                  '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'center',
              }}
            >
              <TrendingDown
                size={18}
                color="#dc2626"
              />
            </div>

            <p
              style={{
                fontWeight: 600,
                margin: 0,
              }}
            >
              Expenses
            </p>
          </div>

          <h2>
            {latestMonth
              ? `$${latestMonth.expenses.toLocaleString(
                  'en-SG',
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}`
              : '$0.00'}
          </h2>

          <span>
            {latestMonth?.month ??
              `No ${selectedYear} data`}
          </span>
        </div>

        {/* SAVINGS */}
        <div className="summary-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor:
                  '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'center',
              }}
            >
              <PiggyBank
                size={18}
                color="#2563eb"
              />
            </div>

            <p
              style={{
                fontWeight: 600,
                margin: 0,
              }}
            >
              Savings
            </p>
          </div>

          <h2>
            {`$${savings.toLocaleString(
              'en-SG',
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}`}
          </h2>

          <span>
            {latestMonth?.month ??
              `No ${selectedYear} data`}
          </span>
        </div>

        {/* INVESTMENTS */}
        <div className="summary-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor:
                  '#ede9fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'center',
              }}
            >
              <ChartNoAxesCombined
                size={18}
                color="#7c3aed"
              />
            </div>

            <p
              style={{
                fontWeight: 600,
                margin: 0,
              }}
            >
              Investments
            </p>
          </div>

          <h2>
            {latestInvestment
              ? `$${latestInvestment.currentValue.toLocaleString(
                  'en-SG',
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}`
              : '$0.00'}
          </h2>

          {latestInvestment ? (
            <>
              <span
                style={{
                  color:
                    latestInvestment.gainPercent >=
                    0
                      ? '#16a34a'
                      : '#dc2626',
                  fontWeight: 600,
                }}
              >
                {latestInvestment.gainPercent >=
                0
                  ? '+'
                  : ''}
                {(
                  latestInvestment.gainPercent *
                  100
                ).toFixed(1)}
                % gain
              </span>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: '#777',
                }}
              >
                {latestInvestment.month}
              </div>
            </>
          ) : (
            <span>
              No {selectedYear} data
            </span>
          )}
        </div>

        {/* NET WORTH */}
        <div className="summary-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor:
                  '#ccfbf1',
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'center',
              }}
            >
              <WalletCards
                size={18}
                color="#0d9488"
              />
            </div>

            <p
              style={{
                fontWeight: 600,
                margin: 0,
              }}
            >
              Net Worth
            </p>
          </div>

          <h2>
            {latestNetWorth
              ? `$${latestNetWorth.netWorth.toLocaleString(
                  'en-SG',
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}`
              : '$0.00'}
          </h2>

          <span>
            {latestNetWorth?.month ??
              `No ${selectedYear} data`}
          </span>
        </div>

        {/* SAVINGS RATE */}
        <div className="summary-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor:
                  '#ffedd5',
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'center',
              }}
            >
              <Percent
                size={18}
                color="#ea580c"
              />
            </div>

            <p
              style={{
                fontWeight: 600,
                margin: 0,
              }}
            >
              Savings Rate
            </p>
          </div>

          <h2
            style={{
              color:
                savingsRateColor,
            }}
          >
            {savingsRate.toFixed(1)}%
          </h2>

          <span>
            {latestMonth?.month ??
              `No ${selectedYear} data`}
          </span>
        </div>

      </section>

      {/* DASHBOARD CHARTS */}
      <section className="dashboard-grid">

        {/* MONTHLY CASH FLOW */}
        <div className="panel large-panel">
          <h2>
            Monthly Cash Flow
          </h2>

          <div
            style={{
              width: '100%',
              height: 340,
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={yearlyMonthlyData.filter(
                  (item) =>
                    item.income > 0 ||
                    item.expenses > 0,
                )}
                margin={{
                  top: 10,
                  right: 35,
                  bottom: 10,
                  left: 10,
                }}
              >
                <XAxis
                  dataKey="month"
                  interval={0}
                  height={48}
                  tick={<MonthTick />}
                />

                <YAxis
                  tickFormatter={(value) =>
                    `$${(
                      value / 1000
                    ).toFixed(0)}k`
                  }
                />

                <Tooltip
                  formatter={(value) =>
                    `$${Number(
                      value,
                    ).toLocaleString(
                      'en-SG',
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}`
                  }
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{
                    fill: '#16a34a',
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#dc2626"
                  strokeWidth={3}
                  dot={{
                    fill: '#dc2626',
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SPENDING BY CATEGORY */}
        <div className="panel">
          <h2>
            Spending by Category
          </h2>

          <div
            style={{
              width: '100%',
              height: 520,
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart
                margin={{
                  top: 50,
                  right: 120,
                  bottom: 50,
                  left: 120,
                }}
              >
                <Pie
                  data={(
                    latestMonth?.categories ??
                    []
                  ).filter(
                    (item: any) =>
                      item.amount > 0,
                  )}
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
                    const RADIAN =
                      Math.PI / 180

                    const radius =
                      outerRadius + 16

                    const x =
                      cx +
                      radius *
                        Math.cos(
                          -midAngle *
                            RADIAN,
                        )

                    const y =
                      cy +
                      radius *
                        Math.sin(
                          -midAngle *
                            RADIAN,
                        )

                    const textAnchor =
                      x > cx
                        ? 'start'
                        : 'end'

                    return (
                      <text
                        x={x}
                        y={y}
                        textAnchor={
                          textAnchor
                        }
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

                        <tspan
                          x={x}
                          dy="1.4em"
                          fontWeight={400}
                        >
                          {`$${Number(
                            value,
                          ).toLocaleString(
                            'en-SG',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}`}
                        </tspan>
                      </text>
                    )
                  }}
                >
                  {(
                    latestMonth?.categories ??
                    []
                  )
                    .filter(
                      (item: any) =>
                        item.amount > 0,
                    )
                    .map(
                      (
                        _: any,
                        index: number,
                      ) => {
                        const colors = [
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

                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              colors[
                                index %
                                  colors.length
                              ]
                            }
                          />
                        )
                      },
                    )}
                </Pie>

                {/* TOTAL IN CENTRE */}
                <text
                  x="50%"
                  y="48%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#222"
                  fontSize={18}
                  fontWeight={700}
                >
                  {`$${Number(
                    latestMonth?.expenses ??
                      0,
                  ).toLocaleString(
                    'en-SG',
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}`}
                </text>

                <text
                  x="50%"
                  y="54%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#666"
                  fontSize={13}
                  fontWeight={500}
                >
                  Total
                </text>

                <Tooltip
                  formatter={(value) =>
                    `$${Number(
                      value,
                    ).toLocaleString(
                      'en-SG',
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GOALS */}
        <div className="panel">
          <h2>Goals</h2>

          {/* HOUSE DOWNPAYMENT */}
          {(() => {
            const houseTarget =
              770000 * 0.25

            const houseCurrent =
              latestNetWorth?.cashPlusOA ??
              0

            const houseProgress =
              houseTarget > 0
                ? Math.min(
                    (
                      houseCurrent /
                      houseTarget
                    ) * 100,
                    100,
                  )
                : 0

            return (
              <div className="goal">

                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    alignItems:
                      'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems:
                        'center',
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor:
                          '#f3e8ff',
                        display: 'flex',
                        alignItems:
                          'center',
                        justifyContent:
                          'center',
                        flexShrink: 0,
                      }}
                    >
                      <House
                        size={19}
                        color="#8b5cf6"
                      />
                    </div>

                    <strong>
                      House Downpayment
                    </strong>
                  </div>

                  <span
                    style={{
                      fontWeight: 700,
                      color: '#8b5cf6',
                    }}
                  >
                    {houseProgress.toFixed(
                      0,
                    )}
                    %
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    marginTop: 10,
                    marginBottom: 8,
                    fontSize: 13,
                    color: '#666',
                  }}
                >
                  <span>
                    $
                    {houseCurrent.toLocaleString(
                      'en-SG',
                      {
                        maximumFractionDigits: 0,
                      },
                    )}
                  </span>

                  <span>
                    $
                    {houseTarget.toLocaleString(
                      'en-SG',
                      {
                        maximumFractionDigits: 0,
                      },
                    )}
                  </span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${houseProgress}%`,
                      backgroundColor:
                        '#8b5cf6',
                    }}
                  />
                </div>

                <div
                  style={{
                    marginTop: 7,
                    fontSize: 12,
                    color: '#888',
                  }}
                >
                  25% of $770,000
                </div>
              </div>
            )
          })()}

          {/* LIQUID ASSET TARGET */}
          {(() => {
            const liquidTarget =
              120000

            const liquidCurrent =
              latestNetWorth?.liquid ??
              0

            const liquidProgress =
              liquidTarget > 0
                ? Math.min(
                    (
                      liquidCurrent /
                      liquidTarget
                    ) * 100,
                    100,
                  )
                : 0

            return (
              <div
                className="goal"
                style={{
                  marginTop: 30,
                }}
              >

                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    alignItems:
                      'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems:
                        'center',
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor:
                          '#ffedd5',
                        display: 'flex',
                        alignItems:
                          'center',
                        justifyContent:
                          'center',
                        flexShrink: 0,
                      }}
                    >
                      <Target
                        size={19}
                        color="#f97316"
                      />
                    </div>

                    <strong>
                      Liquid Asset Target
                    </strong>
                  </div>

                  <span
                    style={{
                      fontWeight: 700,
                      color: '#f97316',
                    }}
                  >
                    {liquidProgress.toFixed(
                      0,
                    )}
                    %
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    marginTop: 10,
                    marginBottom: 8,
                    fontSize: 13,
                    color: '#666',
                  }}
                >
                  <span>
                    $
                    {liquidCurrent.toLocaleString(
                      'en-SG',
                      {
                        maximumFractionDigits: 0,
                      },
                    )}
                  </span>

                  <span>
                    $120,000
                  </span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${liquidProgress}%`,
                      backgroundColor:
                        '#06b6d4',
                    }}
                  />
                </div>

                <div
                  style={{
                    marginTop: 7,
                    fontSize: 12,
                    color: '#888',
                  }}
                >
                  Target by Dec 2026
                </div>
              </div>
            )
          })()}

        </div>

        {/* INVESTMENT GROWTH */}
        <div className="panel large-panel">
          <h2>
            Investment Growth
          </h2>

          <div
            style={{
              width: '100%',
              height: 400,
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <ComposedChart
                data={yearlyInvestmentData.filter(
                  (item) =>
                    item.currentValue > 0,
                )}
                margin={{
                  top: 20,
                  right: 35,
                  bottom: 10,
                  left: 15,
                }}
              >
                <XAxis
                  dataKey="month"
                  interval={0}
                  height={48}
                  tick={<MonthTick />}
                />

                <YAxis
                  tickFormatter={(value) =>
                    `$${(
                      value / 1000
                    ).toFixed(0)}k`
                  }
                />

                <Tooltip
                  formatter={(
                    value,
                    name,
                  ) => [
                    `$${Number(
                      value,
                    ).toLocaleString(
                      'en-SG',
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}`,
                    name,
                  ]}
                />

                <Legend />

                <Bar
                  dataKey="monthlyDeposit"
                  name="Monthly Contribution"
                  fill="#0891b2"
                  barSize={35}
                  radius={[
                    5,
                    5,
                    0,
                    0,
                  ]}
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
                  activeDot={{
                    r: 6,
                  }}
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
                  activeDot={{
                    r: 6,
                  }}
                />

              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* NET WORTH COMPOSITION */}
        <div className="panel large-panel">
          <h2>
            Net Worth Composition
          </h2>

          <div
            style={{
              width: '100%',
              height: 400,
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <ComposedChart
                data={yearlyNetWorthData.filter(
                  (item) =>
                    item.liquid > 0 ||
                    item.nonLiquid > 0,
                )}
                margin={{
                  top: 45,
                  right: 25,
                  bottom: 10,
                  left: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                  interval={0}
                  height={48}
                  tick={<MonthTick />}
                />

                <YAxis
                  tickFormatter={(value) =>
                    `$${(
                      value / 1000
                    ).toFixed(0)}k`
                  }
                />

                <Tooltip
                  formatter={(
                    value,
                    name,
                  ) => [
                    `$${Number(
                      value,
                    ).toLocaleString(
                      'en-SG',
                      {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      },
                    )}`,
                    name,
                  ]}
                />

                <Legend />

                {/* NON-LIQUID ASSETS */}
                <Bar
                  dataKey="nonLiquid"
                  name="Non-Liquid Assets"
                  stackId="networth"
                  fill="#8b5cf6"
                  radius={[
                    0,
                    0,
                    0,
                    0,
                  ]}
                />

                {/* LIQUID ASSETS */}
                <Bar
                  dataKey="liquid"
                  name="Liquid Assets"
                  stackId="networth"
                  fill="#06b6d4"
                  radius={[
                    0,
                    0,
                    0,
                    0,
                  ]}
                >
                  <LabelList
                    dataKey="netWorth"
                    position="top"
                    offset={8}
                    formatter={(
                      value: any,
                    ) =>
                      `$${Number(
                        value,
                      ).toLocaleString(
                        'en-SG',
                        {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        },
                      )}`
                    }
                    style={{
                      fill: '#222',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
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