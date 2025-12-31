import { AppSidebarBody } from "@/Core/Components/AppSidebarBody/AppSidebarBody"
import { AppSidebarCard } from "@/Core/Components/Cards/AppSidebarCard";
import { ThemeDropdown } from "@/Core/Components/Dropdown/ThemeDropdown"
import appSettingsIcon from "@/assets/icons/settings.svg";

export const Settings = () => {
    return (
        <AppSidebarBody appSidebarTitle="AtmosInsight - Configurações" appSidebarIcon={appSettingsIcon} appSidebarBodyStyle="flex-col">
            <div className="mt-8 xl:max-w-[90%]! h-fit w-full flex justify-center align-middle">
                <AppSidebarCard cardTitle="Configurações" cardDescription="Ajuste as opções conforme suas preferências" cardAction={<ThemeDropdown />}>
                    {null}
                </AppSidebarCard>
            </div>
        </AppSidebarBody>
    )
}