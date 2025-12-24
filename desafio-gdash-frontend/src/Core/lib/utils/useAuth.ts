import { AuthContext } from "@/Core/Components/Providers/AuthContext"
import { useContext } from "react"

export const useAuth = () => {
    return useContext(AuthContext)
}