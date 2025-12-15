import { AuthContext } from "@/Core/Components/Utils/AuthContext"
import { useContext } from "react"

export const useAuth = () => {
    return useContext(AuthContext)
}