import { 
    ChartContainer,
    type ChartConfig, 
    ChartTooltip, 
    ChartTooltipContent, 
    ChartLegend, 
    ChartLegendContent 
} from "@/Core/Components/shadcnComponents/Ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, AreaChart, Area, LineChart, Line } from "recharts"

interface DashChartDataPoint {
    collectedAt: string
    formattedCollectedAt: string
    observed?: number
    forecast?: number
}

interface chartTypesProps {
    activeChart: string
    chartUnit?: string
    chartConfig: ChartConfig
    chartType: string
    filteredChartData: DashChartDataPoint[]
}

export const ChartTypes: React.FC<chartTypesProps> = ({
    activeChart,
    chartUnit,
    chartConfig,
    chartType,
    filteredChartData
}) => {
    switch (chartType) {
        case "Bar":
            return (
                <ChartContainer config={chartConfig satisfies ChartConfig} className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart accessibilityLayer data={filteredChartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                              dataKey="collectedAt"
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                              tickFormatter={(value) =>
                                new Intl.DateTimeFormat("pt-BR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                }).format(new Date(value))
                              }
                            />

                            <ChartTooltip 
                              content={
                                <ChartTooltipContent 
                                  labelFormatter={(_, payload) =>
                                    payload?.[0]?.payload?.formattedCollectedAt ?? "-"
                                  }
                                  formatter={(value, name) => (
                                    <>
                                      <div
                                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                                        style={
                                          {
                                            "--color-bg": `var(--color-${name})`,
                                          } as React.CSSProperties
                                        }
                                      />
                                      {chartConfig[name as keyof typeof chartConfig]?.label ||
                                        name}
                                      <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                                        {Math.floor(Number(value))}
                                        <span className="text-muted-foreground font-normal">
                                          {chartUnit}
                                        </span>
                                      </div>
                                    </>
                                  )}
                                />
                              }
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                          
                            {activeChart == 'both' ? (
                                <>
                                  <Bar
                                    dataKey="observed"
                                    fill="var(--color-observed)"
                                    radius={4}
                                  />

                                  <Bar
                                    dataKey="forecast"
                                    fill="var(--color-forecast)"
                                    radius={4}
                                  />
                                </>
                            ) : (
                                <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} radius={4}/>
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            )
        
        case "Area":
            return (
                <ChartContainer config={chartConfig satisfies ChartConfig} className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart accessibilityLayer data={filteredChartData}>
                            <defs>
                              <linearGradient id="fillobserved" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                  offset="5%"
                                  stopColor="var(--color-observed)"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="var(--color-observed)"
                                  stopOpacity={0.1}
                                />
                              </linearGradient>
                              <linearGradient id="fillforecast" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                  offset="5%"
                                  stopColor="var(--color-forecast)"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="var(--color-forecast)"
                                  stopOpacity={0.1}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="collectedAt"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) =>
                                  new Intl.DateTimeFormat("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }).format(new Date(value))
                                }
                            />

                            <ChartTooltip 
                              content={
                                <ChartTooltipContent 
                                  labelFormatter={(_, payload) =>
                                    payload?.[0]?.payload?.formattedCollectedAt ?? "-"
                                  }
                                  formatter={(value, name) => (
                                    <>
                                      <div
                                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                                        style={
                                          {
                                            "--color-bg": `var(--color-${name})`,
                                          } as React.CSSProperties
                                        }
                                      />
                                      {chartConfig[name as keyof typeof chartConfig]?.label ||
                                        name}
                                      <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                                        {Math.floor(Number(value))}
                                        <span className="text-muted-foreground font-normal">
                                          {chartUnit}
                                        </span>
                                      </div>
                                    </>
                                  )}
                                />
                              }
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                          
                            {activeChart == 'both' ? (
                                <>
                                  <Area
                                    dataKey="observed"
                                    type="natural"
                                    fill="url(#fillobserved)"
                                    stroke="var(--color-observed)"
                                    stackId="a"
                                  />

                                  <Area
                                    dataKey="forecast"
                                    type="natural"
                                    fill="url(#fillforecast)"
                                    stroke="var(--color-forecast)"
                                    stackId="a"
                                  />
                                </>
                            ) : (
                                <Area dataKey={activeChart} type="natural" fill={`url(#fill${activeChart})`} stroke={`var(--color-${activeChart})`} stackId="a"/>
                            )}
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            )
        
        case "Line":
            return (
                <ChartContainer config={chartConfig satisfies ChartConfig} className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart accessibilityLayer data={filteredChartData} margin={{left: 12, right: 12,}}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="collectedAt"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) =>
                                  new Intl.DateTimeFormat("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }).format(new Date(value))
                                }
                            />

                            <ChartTooltip 
                              content={
                                <ChartTooltipContent 
                                  labelFormatter={(_, payload) =>
                                    payload?.[0]?.payload?.formattedCollectedAt ?? "-"
                                  }
                                  formatter={(value, name) => (
                                    <>
                                      <div
                                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                                        style={
                                          {
                                            "--color-bg": `var(--color-${name})`,
                                          } as React.CSSProperties
                                        }
                                      />
                                      {chartConfig[name as keyof typeof chartConfig]?.label ||
                                        name}
                                      <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                                        {Math.floor(Number(value))}
                                        <span className="text-muted-foreground font-normal">
                                          {chartUnit}
                                        </span>
                                      </div>
                                    </>
                                  )}
                                />
                              }
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                          
                            {activeChart == 'both' ? (
                                <>
                                  <Line
                                    dataKey="observed"
                                    type="monotone"
                                    stroke="var(--color-observed)"
                                    strokeWidth={2}
                                    dot={false}
                                  />

                                  <Line
                                    dataKey="forecast"
                                    type="monotone"
                                    stroke="var(--color-forecast)"
                                    strokeWidth={2}
                                    dot={false}
                                  />
                                </>
                            ) : (
                                <Line dataKey={activeChart} type="monotone" stroke={`var(--color-${activeChart})`} strokeWidth={2} dot={false}/>
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            )
    }
}