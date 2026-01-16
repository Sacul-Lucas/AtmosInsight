export interface WeatherLogs {
  _id: string;
  locationId: string;
  metrics: {
    temperature: number;
    apparent_temperature: number;
    humidity: number;
    wind_speed: number;
    rain: number;
    precipitation_probability: number;
    visibility: number;
  };
  type: 'observed' | 'forecast';
  condition: string;
  collectedAt: string;
  createdAt: string;
  updatedAt: string;
  source: string;
};

// import { GetWeatherLogsAction } from "@/Core/Actions/GetWeatherLogAction"
// import { AppSidebarBody } from "@/Core/Components/AppSidebarBody/AppSidebarBody"
// import { Skeleton } from "@/Core/Components/shadcnComponents/Ui/skeleton"
// import { AppSidebarCard } from "@/Core/Components/Cards/AppSidebarCard"
// import { Toaster } from "@/Core/Components/shadcnComponents/Ui/sonner"
// import { WeatherCodes } from "@/Core/lib/utils/weatherConditionCodes"
// import type { WeatherLogs } from "@/Core/lib/types/WeatherLogs"
// import { DashChart } from "@/Core/Components/Charts/DashChart"
// import { useEffect, useMemo, useState } from "react"
// import { toast } from "sonner"
// import appDashboardIcon from "@/assets/icons/dashboard.svg"

// type LogViewMode = "observed" | "forecast" | "both"

// export const Dashboard = () => {
//   const [allLogs, setAllLogs] = useState<WeatherLogs[]>([])
//   const [loading, setLoading] = useState(false)
//   const [viewMode, setViewMode] = useState<LogViewMode>("observed")

//   const fetchLogs = async () => {
//     setLoading(true)

//     const res = await GetWeatherLogsAction.execute()
//     const message = res.data

//     if (res.status === "SUCCESS") {
//       setAllLogs(message)
//     } else {
//       toast.error(message, {
//         className: "!bg-red-700 !border-red-800 !text-white"
//       })
//     }

//     setLoading(false)
//   }

//   useEffect(() => {
//     fetchLogs()
//   }, [])

//   /**
//    * Logs filtrados conforme escolha do usuário
//    */
  // const filteredLogs = useMemo(() => {
  //   if (viewMode === "both") return allLogs

  //   return allLogs.filter(log => log.type === viewMode)
  // }, [allLogs, viewMode])

//   /**
//    * Último dado observado (para cards)
//    */
//   const latestObserved = useMemo(() => {
//     return [...allLogs]
//       .filter(log => log.type === "observed")
//       .sort((a, b) =>
//         new Date(b.collectedAt).getTime() -
//         new Date(a.collectedAt).getTime()
//       )[0]
//   }, [allLogs])

//   /**
//    * Série para gráficos
//    */
//   const temperatureSeries = filteredLogs.map(log => ({
//     x: log.collectedAt,
//     y: log.metrics.temperature,
//     type: log.type
//   }))

//   const humiditySeries = filteredLogs.map(log => ({
//     x: log.collectedAt,
//     y: log.metrics.humidity,
//     type: log.type
//   }))

//   return (
//     <AppSidebarBody
//       appSidebarTitle="AtmosInsight - Dashboard"
//       appSidebarIcon={appDashboardIcon}
//       appSidebarBodyStyle="flex-col"
//     >
//       {/* Seletor de visualização */}
      // <div className="flex gap-2 mt-6">
      //   {["observed", "forecast", "both"].map(mode => (
      //     <button
      //       key={mode}
      //       onClick={() => setViewMode(mode as LogViewMode)}
      //       className={`px-4 py-2 rounded text-sm font-medium ${
      //         viewMode === mode
      //           ? "bg-primary text-white"
      //           : "bg-muted text-muted-foreground"
      //       }`}
      //     >
      //       {mode === "both" ? "Observado + Previsão" : mode}
      //     </button>
      //   ))}
      // </div>

//       <div className="grid mt-8 gap-4 grid-cols-2 xl:max-w-[90%]">
//         <AppSidebarCard cardTitle="Temperatura Atual">
//           {loading || !latestObserved ? (
//             <Skeleton className="h-6" />
//           ) : (
//             <span>{Math.round(latestObserved.metrics.temperature)}°C</span>
//           )}
//         </AppSidebarCard>

//         <AppSidebarCard cardTitle="Umidade do Ar">
//           {loading || !latestObserved ? (
//             <Skeleton className="h-6" />
//           ) : (
//             <span>{latestObserved.metrics.humidity}%</span>
//           )}
//         </AppSidebarCard>

//         <AppSidebarCard cardTitle="Velocidade do Vento">
//           {loading || !latestObserved ? (
//             <Skeleton className="h-6" />
//           ) : (
//             <span>{latestObserved.metrics.wind_speed.toFixed(1)} km/h</span>
//           )}
//         </AppSidebarCard>

//         <AppSidebarCard cardTitle="Condição Atual">
//           {loading || !latestObserved ? (
//             <Skeleton className="h-6" />
//           ) : (
//             <span>
//               {WeatherCodes[Number(latestObserved.condition)]}
//             </span>
//           )}
//         </AppSidebarCard>

//         <AppSidebarCard>
//           <DashChart
//             chartTitle="Temperatura ao longo do tempo"
//             chartData={temperatureSeries}
//             chartConfig={{ unit: "°C" }}
//           />
//         </AppSidebarCard>

//         <AppSidebarCard>
//           <DashChart
//             chartTitle="Umidade ao longo do tempo"
//             chartData={humiditySeries}
//             chartConfig={{ unit: "%" }}
//           />
//         </AppSidebarCard>
//       </div>

//       <Toaster position="bottom-left" />
//     </AppSidebarBody>
//   )
// }

// <DashChart
//   chartTitle="Temperatura ao longo do tempo"
//   chartData={temperatureChartData}
  // chartConfig={{
  //   observed: {
  //     label: "Observado",
  //     theme: {
  //       light: "#dc2626",
  //       dark: "#f87171"
  //     }
  //   },
  //   forecast: {
  //     label: "Previsão",
  //     theme: {
  //       light: "#2563eb",
  //       dark: "#60a5fa"
  //     }
  //   },
  //   unit: {
  //     label: "°C"
  //   }
  // }}
// />

// <DashChart
//   chartTitle="Umidade ao longo do tempo"
//   chartData={humidityChartData}
  // chartConfig={{
  //   observed: {
  //     label: "Observado",
  //     theme: {
  //       light: "#0284c7",
  //       dark: "#38bdf8"
  //     }
  //   },
  //   forecast: {
  //     label: "Previsão",
  //     theme: {
  //       light: "#0ea5e9",
  //       dark: "#7dd3fc"
  //     }
  //   },
  //   unit: {
  //     label: "%"
  //   }
  // }}
// />

// import {
//   ChartContainer,
//   type ChartConfig,
//   ChartTooltip,
//   ChartTooltipContent,
//   ChartLegend,
//   ChartLegendContent
// } from "@/Core/Components/shadcnComponents/Ui/chart"
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/Core/Components/shadcnComponents/Ui/resizable"
// import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

// interface DashChartDataPoint {
//   collectedAt: string
//   observed?: number
//   forecast?: number
// }

// interface DashChartProps {
//   chartTitle: string
//   chartData: DashChartDataPoint[]
//   chartConfig: ChartConfig
//   chartPanelHeight?: string
//   chartContainerHeight?: string
// }

// export const DashChart: React.FC<DashChartProps> = ({
//   chartTitle,
//   chartData,
//   chartConfig,
//   chartPanelHeight = "320px",
//   chartContainerHeight = "250px"
// }) => {
//   return (
//     <ResizablePanelGroup
//       direction="vertical"
//       className="min-h-[320px] rounded-lg border md:min-w-[450px]"
//     >
//       <ResizablePanel defaultSize={25}>
//         <div className="flex h-full items-center justify-center p-4">
//           <span className="font-semibold text-sm">{chartTitle}</span>
//         </div>
//       </ResizablePanel>

//       <ResizableHandle />

//       <ResizablePanel defaultSize={75}>
//         <div className="flex h-full items-center justify-center p-4">
//           <ChartContainer
//             config={chartConfig}
//             className="w-full"
//             style={{ height: chartContainerHeight }}
//           >
//             <BarChart data={chartData}>
//               <CartesianGrid vertical={false} />

              // <XAxis
              //   dataKey="collectedAt"
              //   tickLine={false}
              //   axisLine={false}
              //   tickMargin={8}
              //   tickFormatter={(value: string) =>
              //     new Date(value).toLocaleTimeString("pt-BR", {
              //       hour: "2-digit",
              //       minute: "2-digit"
              //     })
              //   }
              // />

              // <ChartTooltip content={<ChartTooltipContent />} />
              // <ChartLegend content={<ChartLegendContent />} />

              // {chartConfig.observed && (
              //   <Bar
              //     dataKey="observed"
              //     fill="var(--color-observed)"
              //     radius={4}
              //   />
              // )}

              // {chartConfig.forecast && (
              //   <Bar
              //     dataKey="forecast"
              //     fill="var(--color-forecast)"
              //     radius={4}
              //   />
              // )}
//             </BarChart>
//           </ChartContainer>
//         </div>
//       </ResizablePanel>
//     </ResizablePanelGroup>
//   )
// }
