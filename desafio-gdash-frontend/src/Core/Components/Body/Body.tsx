import type { ReactNode } from "react"

interface bodyProps {
    children: ReactNode
}

export const Body: React.FC<bodyProps> = ({
    children,
}) => {
    return (
        <div>
            {children}
        </div>
    )
}