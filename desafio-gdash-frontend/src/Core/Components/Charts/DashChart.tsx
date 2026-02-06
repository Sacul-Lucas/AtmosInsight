import { type ChartConfig, } from "@/Core/Components/shadcnComponents/Ui/chart"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/Core/Components/shadcnComponents/Ui/resizable"
import { chartAverage } from "@/Core/lib/utils/calcs"
import { ChartTypes } from "./ChartTypes"
import React from "react"

interface DashChartDataPoint {
  collectedAt: string
  formattedCollectedAt: string
  observed?: number
  forecast?: number
}

interface DashChartProps {
  chartTitle: string
  chartType: string
  chartDescription?: string
  chartData: DashChartDataPoint[]
  chartConfig: ChartConfig
  chartPanelHeight?: string
  chartContainerHeight?: string
  chartUnit?: string
}

export const DashChart: React.FC<DashChartProps> = ({
  chartTitle,
  chartType,
  chartDescription,
  chartData,
  chartConfig,
  chartPanelHeight = "45dvh",
  chartUnit
}) => {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("observed")
  const chartKeys = ["observed", "forecast", "both"] as const

  const averages = React.useMemo(() => {
    return {
      observed: chartAverage(
        chartData
          .map(d => d.observed)
          .filter((v): v is number => v !== undefined)
      ),

      forecast: chartAverage(
        chartData
          .map(d => d.forecast)
          .filter((v): v is number => v !== undefined)
      ),

      both: chartAverage(
        chartData
          .flatMap(d => [d.observed, d.forecast])
          .filter((v): v is number => v !== undefined)
      )
    }
  }, [chartData])

  const filteredChartData = React.useMemo(() => {
    switch (activeChart) {
      case "observed":
        return chartData.filter(d => d.observed !== undefined)
    
      case "forecast":
        return chartData.filter(d => d.forecast !== undefined)
    
      case "both":
        return chartData
    
      default:
        return chartData
    }
  }, [chartData, activeChart])

  return (
    <ResizablePanelGroup
      direction="vertical"
      className={`min-h-[200px] rounded-lg border md:min-w-[450px]`}
      style={ {
        height: chartPanelHeight
      } }
    >
      <ResizablePanel defaultSize={30} className="flex items-center w-full flex-row">
        <div className="flex flex-col h-full p-6 gap-2">
          <span className="leading-none font-semibold">{chartTitle}</span>
          <span className="text-muted-foreground text-sm">{chartDescription}</span>
        </div>
        <div className="flex ml-auto">
          {chartKeys.map((chart) => {
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6 cursor-pointer"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-xl">
                  {Math.floor(averages[chart]).toLocaleString() + chartUnit}
                </span>
              </button>
            )
          })}
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full items-center justify-center p-6">
          <ChartTypes activeChart={activeChart} chartUnit={chartUnit} chartConfig={chartConfig} chartType={chartType} filteredChartData={filteredChartData}/>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}