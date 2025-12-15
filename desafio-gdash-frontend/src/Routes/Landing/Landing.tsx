import { DefineApp } from "@/Core/Components/Utils/DefineApp"
import landingIcon from "@/assets/icons/home.svg"

export const Landing = () => {
    return (
        <DefineApp appTitle="AtmosInsight" appIcon={landingIcon}>
            <div></div>
        </DefineApp>
    )
}