import { AppSidebarBody } from "@/Core/Components/AppSidebarBody/AppSidebarBody"
import { ThemeDropdown } from "@/Core/Components/Dropdown/ThemeDropdown"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/Core/Components/shadcnComponents/Ui/card";
// import { Input } from "@/Core/Components/shadcnComponents/Ui/input";
// import { Label } from "@/Core/Components/shadcnComponents/Ui/label";
import appSettingsIcon from "@/assets/icons/settings.svg";

export const Settings = () => {
    return (
        <AppSidebarBody appSidebarTitle="AtmosInsight - Configurações" appSidebarIcon={appSettingsIcon} appSidebarBodyStyle="flex-col">
            <div className="mt-8 xl:max-w-[85%]! h-fit w-full flex justify-center align-middle">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Configurações</CardTitle>
                        <CardDescription>
                            Ajuste as opções conforme suas preferências
                        </CardDescription>
                        <CardAction>
                            <ThemeDropdown />
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        {/* <form>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <a
                                            href="#"
                                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
                                    <Input id="password" type="password" required />
                                </div>
                            </div>
                        </form> */}
                    </CardContent>
                    {/* <CardFooter className="flex-col gap-2">
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                        <Button variant="outline" className="w-full">
                            Login with Google
                        </Button>
                    </CardFooter> */}
                </Card>
            </div>
        </AppSidebarBody>
    )
}