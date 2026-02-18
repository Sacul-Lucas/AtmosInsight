import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Core/Components/shadcnComponents/Ui/dropdown-menu"
import { Checkbox } from "@/Core/Components/shadcnComponents/Ui/checkbox"
import { Button } from "@/Core/Components/shadcnComponents/Ui/button"
import type { WeatherLogs } from "@/Core/lib/types/WeatherLogs"
import { formatDate } from "@/Core/lib/utils/dateFormatter"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { ArrowUpDown } from "lucide-react"

export const WeatherLogDataColumns: ColumnDef<WeatherLogs>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todas"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "locationId",
    header: "Localização",
  },

  {
    accessorFn: (row) => row.metrics.temperature,
    id: "temperature",
    header: "Temperatura",
    cell: ({ row }) => {
      const value = row.getValue("temperature") as number
      return <div className="font-medium">{Math.trunc(Number(value))}°C</div>
    },
  },

  {
    accessorFn: (row) => row.metrics.apparent_temperature,
    id: "apparent_temperature",
    header: "Sensação térmica",
    cell: ({ row }) => {
      const value = row.getValue("apparent_temperature") as number
      return <div className="font-medium">{Math.trunc(Number(value))}°C</div>
    },
  },

  {
    accessorFn: (row) => row.metrics.humidity,
    id: "humidity",
    header: "Humidade",
    cell: ({ row }) => {
      const value = row.getValue("humidity") as number
      return <div className="font-medium">{Math.trunc(Number(value))}%</div>
    },
  },

  {
    accessorKey: "conditionLabel",
    header: "Condição do tempo",
  },

  {
    accessorKey: "collectedAt",
    header: "Data referenciada",
    cell: ({ row }) => {
      const formattedDate = formatDate(row.getValue("collectedAt"))
      
      return <div className="font-medium">{formattedDate}</div>
    },
  },

  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          Tipo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dataType = row.getValue("type")
      
      const formattedDataType = dataType == 'forecast' ? 'Previsão' : 'Observado'
      
      return <div className="font-medium">{formattedDataType}</div>
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const weatherLog = row.original
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(weatherLog.locationId)}
            >
              Copiar id da localização
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]