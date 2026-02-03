import { GetWeatherLogsAction } from "@/Core/Actions/GetWeatherLogAction"
import { AppSidebarBody } from "@/Core/Components/AppSidebarBody/AppSidebarBody"
import { Skeleton } from "@/Core/Components/shadcnComponents/Ui/skeleton"
import { AppSidebarCard } from "@/Core/Components/Cards/AppSidebarCard"
import { Toaster } from "@/Core/Components/shadcnComponents/Ui/sonner"
import { WeatherCodes } from "@/Core/lib/utils/weatherConditionCodes"
import type { WeatherLogs } from "@/Core/lib/types/WeatherLogs"
import { DashChart } from "@/Core/Components/Charts/DashChart"
import { formatDate } from "@/Core/lib/utils/dateFormatter"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import appDashboardIcon from "@/assets/icons/dashboard.svg"

export const Dashboard = () => {
  const [logs, setLogs] = useState<WeatherLogs[]>([]);
  const [loading, setLoading] = useState(false);
  
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
    return useMemo(() => {
      const now = new Date().getTime()

      const SIX_HOURS = 6 * 60 * 60 * 1000
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000

      const minTime = now - SIX_HOURS
      const maxTime = now + TWENTY_FOUR_HOURS

      const grouped: Record<
        string,
        {
          collectedAt: string
          formattedCollectedAt: string
          observed?: number
          forecast?: number
        }
      > = {}

      for (const log of logs) {
        const timestamp = new Date(log.collectedAt).getTime()

        if (timestamp < minTime || timestamp > maxTime) continue

        if (log.type === "forecast" && timestamp <= now) continue
        if (log.type === "observed" && timestamp > now) continue

        const key = log.collectedAt

        if (!grouped[key]) {
          grouped[key] = {
            collectedAt: log.collectedAt,
            formattedCollectedAt: formatDate(log.collectedAt),
          }
        }

        grouped[key][log.type] = log.metrics[dataType]
      }

      return Object.values(grouped).sort(
        (a, b) =>
          new Date(a.collectedAt).getTime() -
          new Date(b.collectedAt).getTime()
      )
    }, [logs, dataType])
  }

  useEffect(() => {
    fetchLogs()
  
    const interval = setInterval(() => {
      fetchLogs()
    }, 5 * 60 * 1000)
  
    return () => clearInterval(interval)
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

        <AppSidebarCard cardTitle="Umidade do ar" cardWidth="w-full" cardDescription="Porcentagem atual de umidade do ar">
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

        <AppSidebarCard cardTitle="Sensação térmica" cardWidth="w-full" cardDescription="Medida da temperatura aparente sentida pelo corpo">
          <span>
            {loading || !latestObserved ? 
              (<Skeleton className="h-6"/>) 
              : 
              `${Math.floor(latestObserved.metrics.apparent_temperature)}°C`
            }
          </span>
        </AppSidebarCard>

        <AppSidebarCard cardTitle="Visibilidade" cardWidth="w-full" cardDescription="Distância de visibilidade, que pode ser influenciada por nuvens baixas, umidade e aerossóis">
          <span>
            {loading || !latestObserved ? 
              (<Skeleton className="h-6"/>) 
              : 
              `${latestObserved.metrics.visibility}m`
            }
          </span>
        </AppSidebarCard>

        <AppSidebarCard cardWidth="w-full">
          <DashChart 
            chartTitle="Gráfico em barras - Temperaturas" 
            chartType="Bar"
            chartDescription="Exibindo valores das últimas 6 horas e das próximas 24 horas"
            chartData={chartData('temperature')}
            chartUnit="C°"
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
              both: {
                label: "Ambos"
              }
            }}
          />
        </AppSidebarCard>

        <AppSidebarCard cardWidth="w-full">
          <DashChart 
            chartTitle="Gráfico em área - Probabilidade de precipitação" 
            chartType="Area"
            chartDescription="Exibindo valores das últimas 6 horas e das próximas 24 horas"
            chartData={chartData('precipitation_probability')}
            chartUnit="%"
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
              both: {
                label: "Ambos"
              }
            }}
          />
        </AppSidebarCard>

        <AppSidebarCard cardWidth="w-full">
          <DashChart 
            chartTitle="Gráfico em barras - Sensação térmica" 
            chartType="Bar"
            chartDescription="Exibindo valores das últimas 6 horas e das próximas 24 horas"
            chartData={chartData('apparent_temperature')}
            chartUnit="°C"
            chartConfig={{
              observed: {
                label: "Observado",
                theme: {
                  light: "#dc2626",
                  dark: "#F54E4E"
                }
              },
              forecast: {
                label: "Previsão",
                theme: {
                  light: "#2563eb",
                  dark: "#506BF2"
                }
              },
              both: {
                label: "Ambos"
              }
            }}
          />
        </AppSidebarCard>

        <AppSidebarCard cardWidth="w-full">
          <DashChart 
            chartTitle="Gráfico em linhas - Umidade do ar" 
            chartType="Line"
            chartDescription="Exibindo valores das últimas 6 horas e das próximas 24 horas"
            chartData={chartData('humidity')}
            chartUnit="%"
            chartConfig={{
              observed: {
                label: "Observado",
                theme: {
                  light: "#90BAF9",
                  dark: "#8EB9FB"
                }
              },
              forecast: {
                label: "Previsão",
                theme: {
                  light: "#5193F5",
                  dark: "#629EF9"
                }
              },
              both: {
                label: "Ambos"
              }
            }}
          />
        </AppSidebarCard>
      </div>
      <Toaster position="bottom-left"/>
    </AppSidebarBody>
  )
}