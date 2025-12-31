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
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

interface chartProps {
  chartTitle: string;
  chartData: Array<Object>;
  chartConfig: ChartConfig;
  chartPanelHeight?: string;
  chartContainerHeight?: string;
}

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ]
// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "#2563eb",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "#60a5fa",
//   },
// } satisfies ChartConfig


export const DashChart: React.FC<chartProps> = ({
    chartTitle,
    chartData,
    chartConfig,
    chartPanelHeight,
    chartContainerHeight = "250px"
}) => {
  return (
    <ResizablePanelGroup
      direction="vertical"
      className={`min-h-[200px] max-h-1/2 h-[${chartPanelHeight}] max-w-1/2 rounded-lg border md:min-w-[450px]`}
    >
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">{chartTitle}</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full items-center justify-center p-6">
          <ChartContainer config={chartConfig} className={`h-[${chartContainerHeight}] w-80`}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent payload={undefined} />} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}