import { AppRoutes } from "@/Routes/Router"
import { ThemeProvider } from "./Core/Components/Providers/ThemeContext"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App