import { 
  ChartContainer, 
  type ChartConfig, 
  ChartTooltip, 
  ChartTooltipContent, 
  ChartLegend, 
  ChartLegendContent 
} from "@/Core/Components/shadcnComponents/Ui/chart"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/Core/Components/shadcnComponents/Ui/resizable"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis } from "recharts"

interface DashChartDataPoint {
  collectedAt: string
  observed?: number
  forecast?: number
}

interface DashChartProps {
  chartTitle: string
  chartData: DashChartDataPoint[]
  chartConfig: ChartConfig
  chartPanelHeight?: string
  chartContainerHeight?: string
  chartUnit?: string
}

export const DashChart: React.FC<DashChartProps> = ({
  chartTitle,
  chartData,
  chartConfig,
  chartPanelHeight = "45dvh",
  chartUnit
}) => {
  return (
    <ResizablePanelGroup
      direction="vertical"
      className={`min-h-[200px] rounded-lg border md:min-w-[450px]`}
      style={ {
        height: chartPanelHeight
      } }
    >
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">{chartTitle}</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full items-center justify-center p-6">
          <ChartContainer config={chartConfig satisfies ChartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid />
                <XAxis
                  dataKey="collectedAt"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value: string) => value.slice(11, 17)}
                />

                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
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
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}