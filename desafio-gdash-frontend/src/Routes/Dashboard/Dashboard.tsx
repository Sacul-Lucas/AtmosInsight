import { GetWeatherLogsAction } from "@/Core/Actions/GetWeatherLogAction"
import { AppSidebarBody } from "@/Core/Components/AppSidebarBody/AppSidebarBody"
import { AppSidebarCard } from "@/Core/Components/Cards/AppSidebarCard"
import { Toaster } from "@/Core/Components/shadcnComponents/Ui/sonner"
import type { WeatherLogs } from "@/Core/lib/types/WeatherLogs"
import { DashChart } from "@/Core/Components/Charts/DashChart"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import appDashboardIcon from "@/assets/icons/dashboard.svg"
import { WeatherCodes } from "@/Core/lib/utils/weatherConditionCodes"

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

  useEffect(() => {
    fetchLogs()
  }, [])
  
  return (
    <AppSidebarBody appSidebarTitle="AtmosInsight - Dashboard" appSidebarIcon={appDashboardIcon} appSidebarBodyStyle="flex-col">
      <div className='gap-4 grid-cols-[repeat(2,1fr)] grid mt-8 xl:max-w-[90%]! h-auto w-full justify-center items-center align-middle'>
        <AppSidebarCard cardTitle="Temperatura Atual" cardWidth="w-full" cardDescription="Valor medido pelo sensor de temperatura">
          <span>{logs[0]?.temperature}°C</span>
        </AppSidebarCard>

        <AppSidebarCard cardTitle="Humidade do ar" cardWidth="w-full" cardDescription="Porcentagem atual de humidade do ar">
          <span>{logs[0]?.humidity}%</span>
        </AppSidebarCard>

        <AppSidebarCard cardTitle="Velocidade do vento" cardWidth="w-full" cardDescription="Velocidade do vento mensurada em m/s">
          <span>{logs[0]?.windSpeed}m/s</span>
        </AppSidebarCard>

        <AppSidebarCard cardTitle="Condição do tempo" cardWidth="w-full" cardDescription="Condição do clima atual de acordo com o código do sensor">
          <span>{WeatherCodes[Number(logs[0]?.condition)]}</span>
        </AppSidebarCard>

        <AppSidebarCard>
          <DashChart chartTitle="Gráfico de temperaturas" chartConfig={{}} chartData={[]}/>
        </AppSidebarCard>

        <AppSidebarCard>
          <DashChart chartTitle="Gráfico de humidade" chartConfig={{}} chartData={[]}/>
        </AppSidebarCard>
      </div>
      <Toaster position="bottom-left"/>
    </AppSidebarBody>
  )
}