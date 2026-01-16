import { GetWeatherLogsAction } from "@/Core/Actions/GetWeatherLogAction"
import { AppSidebarBody } from "@/Core/Components/AppSidebarBody/AppSidebarBody"
import { Skeleton } from "@/Core/Components/shadcnComponents/Ui/skeleton"
import { AppSidebarCard } from "@/Core/Components/Cards/AppSidebarCard"
import { Toaster } from "@/Core/Components/shadcnComponents/Ui/sonner"
import { WeatherCodes } from "@/Core/lib/utils/weatherConditionCodes"
import type { WeatherLogs } from "@/Core/lib/types/WeatherLogs"
import { DashChart } from "@/Core/Components/Charts/DashChart"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import appDashboardIcon from "@/assets/icons/dashboard.svg"

type LogViewMode = 'observed' | 'forecast' | 'timeseries' | null

export const Dashboard = () => {
  const [logs, setLogs] = useState<WeatherLogs[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<LogViewMode>('observed')
  
  const fetchLogs = async () => {
    setLoading(true);

    const fetchLogsRes = await GetWeatherLogsAction.execute();
    const fetchLogsMessage = fetchLogsRes.data

    switch (fetchLogsRes.status) {
      case 'SUCCESS':
        setLogs(fetchLogsMessage);
        break;

      case 'WEATHER_LOGS_NOT_FOUND':
        toast.error(fetchLogsMessage, {
          className: "!bg-red-700 !border-red-800 !text-white !align-middle"
        });
        break;
    
      case 'TOKEN_NOT_FOUND':  
      case 'INVALID_TOKEN':
      case 'UNKNOWN':
        toast.error(fetchLogsMessage, {
          className: "!bg-red-700 !border-red-800 !text-white !align-middle"
        });
        break;
    
      default:
        break;
    }
    setLoading(false);
  };

  const latestObserved = useMemo(() => {
    return [...logs]
      .filter(log => log.type === "observed")
      .sort(
        (a, b) =>
          new Date(b.collectedAt).getTime() -
          new Date(a.collectedAt).getTime()
      )[0]
  }, [logs])

  const chartData = (dataType: keyof WeatherLogs["metrics"]) => {
    return (
      useMemo(() => {
        const map = new Map<string, any>()
        const metric = dataType

        logs.forEach(log => {
          const entry =
            map.get(log.collectedAt) || { collectedAt: log.collectedAt }
        
          entry[log.type] = log.metrics[metric]
          map.set(log.collectedAt, entry)
        })
      
        return Array.from(map.values())
      }, [logs])
    )
  }

  console.log(chartData('temperature'))

  useEffect(() => {
    fetchLogs()
  }, [])
  
  return (
    <AppSidebarBody appSidebarTitle="AtmosInsight - Dashboard" appSidebarIcon={appDashboardIcon} appSidebarBodyStyle="flex-col">
      <div className='gap-4 grid-cols-[repeat(2,1fr)] grid mt-8 xl:max-w-[90%]! h-auto w-full justify-center items-center align-middle'>
        <AppSidebarCard cardTitle="Temperatura Atual" cardWidth="w-full" cardDescription="Valor medido pelo sensor de temperatura">
          <span>
            {loading || !latestObserved ? 
              (<Skeleton className="h-6"/>) : 
              `${Math.floor(latestObserved.metrics.temperature)}°C`
            }
          </span>
        </AppSidebarCard>

        <AppSidebarCard cardTitle="Umidade do ar" cardWidth="w-full" cardDescription="Porcentagem atual de humidade do ar">
          <span>
            {loading || !latestObserved ? 
              (<Skeleton className="h-6"/>) : 
              `${latestObserved.metrics.humidity}%`
            }
          </span>
        </AppSidebarCard>

        <AppSidebarCard cardTitle="Velocidade do vento" cardWidth="w-full" cardDescription="Velocidade do vento mensurada em km/h">
          <span>
            {loading || !latestObserved ? 
              (<Skeleton className="h-6"/>) : 
              `${latestObserved.metrics.wind_speed?.toFixed(2)}km/h`
            }
          </span>
        </AppSidebarCard>

        <AppSidebarCard cardTitle="Condição do tempo" cardWidth="w-full" cardDescription="Condição do clima atual de acordo com o código do sensor">
          <span>
            {loading || !latestObserved ? 
              (<Skeleton className="h-6"/>) 
              : 
              WeatherCodes[Number(latestObserved.condition)]
            }
          </span>
        </AppSidebarCard>

        <AppSidebarCard cardWidth="w-full">
          <DashChart 
            chartTitle="Gráfico de temperaturas" 
            chartData={chartData('temperature')}
            chartConfig={{
              observed: {
                label: "Observado",
                theme: {
                  light: "#dc2626",
                  dark: "#f87171"
                }
              },
              forecast: {
                label: "Previsão",
                theme: {
                  light: "#2563eb",
                  dark: "#60a5fa"
                }
              },
              unit: {
                label: "°C"
              }
            }}
          />
        </AppSidebarCard>

        <AppSidebarCard cardWidth="w-full">
          <DashChart 
            chartTitle="Gráfico de probabilidade de chuva" 
            chartData={chartData('precipitation_probability')}
            chartConfig={{
              observed: {
                label: "Observado",
                theme: {
                  light: "#0284c7",
                  dark: "#38bdf8"
                }
              },
              forecast: {
                label: "Previsão",
                theme: {
                  light: "#0ea5e9",
                  dark: "#7dd3fc"
                }
              },
              unit: {
                label: "%"
              }
            }}
          />
        </AppSidebarCard>
      </div>
      <Toaster position="bottom-left"/>
    </AppSidebarBody>
  )
}