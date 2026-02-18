import * as React from "react"
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/Core/Components/shadcnComponents/Ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/Core/Components/shadcnComponents/Ui/dropdown-menu"
import { ExportWeatherDataAction } from "@/Core/Actions/ExportWeatherDataAction"
import { Separator } from "@/Core/Components/shadcnComponents/Ui/separator"
import { Toaster } from "@/Core/Components/shadcnComponents/Ui/sonner"
import { Button } from "@/Core/Components/shadcnComponents/Ui/button"
import { Input } from "@/Core/Components/shadcnComponents/Ui/input"
import { toast } from "sonner"

interface WeatherLogDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function WeatherLogDataTable<TData, TValue>({
  columns,
  data,
}: WeatherLogDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    }
  })

  const handleExportWeatherData = async (exportType: string) => {
    const exportRes = await ExportWeatherDataAction.execute(exportType);

    switch (exportRes.status) {
      case 'SUCCESS':
        toast.success("Arquivo exportado com sucesso!", {
          className: "!bg-green-700 !border-green-800 !text-white !align-middle"
        });
        break;

      case 'DATA_NOT_FOUND':
        toast.error(exportRes.data, {
          className: "!bg-red-700 !border-red-800 !text-white !align-middle"
        });
        break;

      case 'TOKEN_NOT_FOUND':
      case 'INVALID_TOKEN':
      case 'ACCESS_DENIED':
      case 'UNKNOWN':
        toast.error(exportRes.data, {
          className: "!bg-red-700 !border-red-800 !text-white !align-middle"
        });
        break;

      default:
        break;
    }
  }
  
  return (
    <div className="mt-8 xl:max-w-[90%]! h-fit w-full">
      <div>
        <div className="space-y-1">
          <h1 className="text-sm leading-none font-medium">Regitsros climáticos</h1>
          <p className="text-muted-foreground text-sm">
            Visão completa dos dados climáticos coletados via Open-Meteo
          </p>
        </div>
        <Separator className="my-2" />
        <div className="flex flex-row items-center py-4">
          <Input
            placeholder="Filtrar localizações..."
            value={table.getColumn("locationId")?.getFilterValue() as string}
            onChange={(event) =>
              table.getColumn("locationId")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />

          <div className="flex flex-row gap-2 ml-auto">
            <Button
              variant="outline"
              onClick={() => handleExportWeatherData("xlsx")}
            >
              Exportar XLSX
            </Button>  

            <Button
              variant="outline"
              onClick={() => handleExportWeatherData("csv")}
            >
              Exportar CSV
            </Button>   

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Colunas
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter(
                    (column) => column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        }
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Sem resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="text-muted-foreground flex-1 text-sm mt-2">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </div>
      </div>

      <Toaster position="bottom-left"/>
    </div>
  )
}