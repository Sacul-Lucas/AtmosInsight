import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Core/Components/shadcnComponents/Ui/dropdown-menu"
import { Button } from "@/Core/Components/shadcnComponents/Ui/button"
import { useTheme } from "../Providers/ThemeContext"
import { Moon, Sun } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../shadcnComponents/Ui/tooltip"

export function ThemeDropdown() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
        <Tooltip>
            <DropdownMenuTrigger asChild>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="cursor-pointer">
                        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all  dark:scale-0 dark:-rotate-90" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                        <span className="sr-only">Trocar tema</span>
                    </Button>
                </TooltipTrigger>
            </DropdownMenuTrigger>
            <TooltipContent>
                <p>Selecionar tema</p>
            </TooltipContent>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                    Claro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                    Escuro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                    Sistema
                </DropdownMenuItem>
            </DropdownMenuContent>
        </Tooltip>
    </DropdownMenu>
  )
}