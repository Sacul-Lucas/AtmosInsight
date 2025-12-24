import type { ReactNode } from "react"
import { SidebarProvider, SidebarTrigger } from "@/Core/Components/shadcnComponents/Ui/sidebar"
import { AppSidebar } from "@/Core/Components/AppSidebar/AppSidebar"
import { DefineApp } from "../Utils/DefineApp"
import { AuthProvider } from "../Providers/AuthContext"

interface bodyProps {
    appSidebarTitle: string
    appSidebarIcon: string
    appSidebarBodyStyle?: string
    children: ReactNode
}

export const AppSidebarBody: React.FC<bodyProps> = ({
    appSidebarTitle,
    appSidebarIcon,
    appSidebarBodyStyle,
    children
}) => {
    return (
        <DefineApp appTitle={appSidebarTitle} appIcon={appSidebarIcon}>
            <AuthProvider>
                <SidebarProvider>
                    <AppSidebar />
                    <div className="h-fit">
                        <SidebarTrigger className="cursor-pointer"/>
                    </div>
                    <main className={`flex items-center w-full ${appSidebarBodyStyle}`}>
                        {children}
                    </main>
                </SidebarProvider>
            </AuthProvider>
        </DefineApp>
    )
}