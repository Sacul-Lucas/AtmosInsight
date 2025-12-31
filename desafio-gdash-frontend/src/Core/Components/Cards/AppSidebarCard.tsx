import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/Core/Components/shadcnComponents/Ui/card";

interface AppSidebarCardProps {
    cardTitle?: string;
    cardDescription?: string;
    cardAction?: React.ReactNode;
    cardFooter?: React.ReactNode;
    children: React.ReactNode;
    cardWidth?: string;
}

export const AppSidebarCard: React.FC<AppSidebarCardProps> = ({
    cardTitle,
    cardDescription,
    cardAction,
    cardFooter,
    children,
    cardWidth = "w-full"
}) => {
    return (
        <Card className={cardWidth}>
            {(cardTitle || cardDescription || cardAction) && <CardHeader>
                {cardTitle && <CardTitle>{cardTitle}</CardTitle>}
                {cardDescription && <CardDescription>{cardDescription}</CardDescription>}
                {cardAction && <CardAction>{cardAction}</CardAction>}
            </CardHeader>}
            <CardContent>
                {children}
            </CardContent>
            {cardFooter && <CardFooter className="flex-col gap-2">{cardFooter}</CardFooter>}
        </Card>
    )
}