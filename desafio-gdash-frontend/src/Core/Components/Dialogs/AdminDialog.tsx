import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Core/Components/shadcnComponents/Ui/dialog"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/Core/Components/shadcnComponents/Ui/context-menu"
import {
  Eye,
  EyeClosed
} from "lucide-react"
import { Button } from "@/Core/Components/shadcnComponents/Ui/button"
import { useEffect, useState, type ReactNode } from "react"
import { Input } from "../shadcnComponents/Ui/input";
import { DeleteUserAction } from "@/Core/Actions/DeleteUserAction";
import { toast } from "sonner"
import type { User } from "@/Core/lib/types/User";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../shadcnComponents/Ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { formSchema } from "@/Core/lib/utils/userFormSchema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../shadcnComponents/Ui/select";
import { UpdateUserAction } from "@/Core/Actions/UpdateUserAction";
import { CreateUserAction } from "@/Core/Actions/CreateUserAction";

interface AdminDialogProps {
    user: User
    children: ReactNode;
    onChange: () => void;
}

export const AdminDialog: React.FC<AdminDialogProps> = ({
    user,
    children,
    onChange
}) => {
    const [open, setOpen] = useState(false)
    const [dialogAction, setDialogAction] = useState<"create" | "view" | "edit" | "delete" | null>(null)
    const isEditable = dialogAction === "edit" || dialogAction === "create"

    const [showPassword, setShowPassword] = useState(false);

    const handleAction = (action: "create" | "view" | "edit" | "delete") => {
        setDialogAction(action)
        setOpen(true)
    }

    const getDialogContent = () => {
        switch (dialogAction) {
            case "create":
                return {
                    title: "Criar item",
                    description: "Aqui você pode criar um novo item."
                }
            case "view":
                return {
                    title: "Visualizar item",
                    description: "Aqui você pode visualizar os detalhes do item."
                }
            case "edit":
                return {
                    title: "Editar item",
                    description: "Modifique as informações do item abaixo."
                }
            case "delete":
                return {
                    title: "Tem certeza?",
                    description: "Essa ação não pode ser desfeita. Deseja excluir o item?"
                }
            default:
                return { title: "", description: "" }
        }
    }

    const { title, description } = getDialogContent()

    const createUser = async (authValues: z.infer<typeof formSchema>) => {
        const { username, email, password, usertype } = authValues;
    
        const registerRes = await CreateUserAction.execute({ username, email, password, usertype });
        const message = registerRes.data;
    
        switch (registerRes.status) {
            case "SUCCESS":
                toast.success(message, {
                    className: "!bg-emerald-700 !border-emerald-800 !text-white"
                });
                onChange();
                setOpen(false);
                break;
            
            case "EMAIL_ALREADY_EXISTS":
            case "UNKNOWN":
                toast.error(message, {
                    className: "!bg-red-700 !border-red-800 !text-white"
                });
                break;
            
            default:
                toast.error("Não foi possível criar a conta no momento. Tente novamente mais tarde.", {
                    className: "!bg-red-700 !border-red-800 !text-white"
                });
                break;
        }
      };

    const updateUser = async (authValues: z.infer<typeof formSchema>) => {
        const { username, email, usertype } = authValues;

        const updateUserRes = await UpdateUserAction.execute({ username, email, usertype }, user._id)
        const updateUserMessage = updateUserRes.data

        switch (updateUserRes.status) {
            case "SUCCESS":
                toast.success(updateUserMessage, {
                    className: "!bg-emerald-700 !border-emerald-800 !text-white"
                });
                onChange();
                setOpen(false);
                break;
            
            case "EMAIL_ALREADY_EXISTS":
            case "UNKNOWN":
                toast.error(updateUserMessage, {
                    className: "!bg-red-700 !border-red-800 !text-white"
                });
                break;
            
            default:
                toast.error("Não foi possível criar a conta no momento. Tente novamente mais tarde.", {
                    className: "!bg-red-700 !border-red-800 !text-white"
                });
                break;
        }
    }

    const deleteUser = async () => {
        const deleteUserRes = await DeleteUserAction.execute(user._id);
        const deleteUserMessage = deleteUserRes.data

        switch (deleteUserRes.status) {
            case 'SUCCESS':
                toast.success(deleteUserMessage, {
                    className: "!bg-emerald-700 !border-emerald-800 !text-white"
                });
                onChange();
                setOpen(false);
                break;
            
            case 'USER_NOT_FOUND':
                toast.error(deleteUserMessage, {
                  className: "!bg-red-700 !border-red-800 !text-white !align-middle"
                });
                break;
            
            case 'TOKEN_NOT_FOUND':  
            case 'INVALID_TOKEN':
            case 'ACCESS_DENIED':
            case 'UNKNOWN':
                toast.error(deleteUserMessage, {
                  className: "!bg-red-700 !border-red-800 !text-white !align-middle"
                });
                break;
            
            default:
                break;
        }
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            usertype: ''
        },
    })

    useEffect(() => {
        if (!open) return
        if (!dialogAction || dialogAction === "delete") return

        if (dialogAction !== "create") {
            form.reset({
                username: user.username,
                email: user.email,
                password: user.password ?? "",
                usertype: user.role
            })
        } else {
            form.reset({
                username: '',
                email: '',
                password: '',
                usertype: ''
            })
        }
    }, [open, dialogAction])


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <ContextMenu>
                <ContextMenuTrigger asChild children={children}/>
                
                <ContextMenuContent>
                    <ContextMenuItem className="cursor-pointer" onClick={() => handleAction("create")}>
                        Novo usuário
                    </ContextMenuItem>
                    <ContextMenuItem className="cursor-pointer" onClick={() => handleAction("view")}>
                        Visualizar
                    </ContextMenuItem>
                    <ContextMenuItem className="cursor-pointer" onClick={() => handleAction("edit")}>
                        Editar
                    </ContextMenuItem>
                    <ContextMenuItem className="cursor-pointer" onClick={() => handleAction("delete")}>
                        Deletar
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {dialogAction !== "delete" ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(dialogAction === "create" ? createUser : updateUser)}>
                            <div className="grid gap-4">
                                <FormField 
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-3">
                                            <FormLabel>
                                                Nome de usuário
                                            </FormLabel>

                                            <FormControl>
                                                <Input id="username-1" type="text" readOnly={!isEditable} {...field}/>
                                            </FormControl>

                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField 
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-3">
                                            <FormLabel>
                                                Email
                                            </FormLabel>

                                            <FormControl>
                                                <Input id="email-1" type="text" readOnly={!isEditable} {...field}/>
                                            </FormControl>

                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {dialogAction === "create" ? (
                                    <FormField 
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="grid gap-3">
                                                <FormLabel>
                                                    Senha
                                                </FormLabel>

                                                <div className="relative">
                                                    <FormControl>
                                                        <Input 
                                                            readOnly={!isEditable} 
                                                            type={showPassword ? "text" : "password"} 
                                                            autoComplete="off"
                                                            {...field}
                                                        />
                                                    </FormControl>

                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 hover:text-black cursor-pointer"
                                                    >
                                                        {showPassword ? <Eye /> : <EyeClosed />}
                                                    </button>
                                                </div>

                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                ) : (null)}

                                <FormField 
                                    control={form.control}
                                    name="usertype"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-3">
                                            <FormLabel>
                                                Tipo de usuário
                                            </FormLabel>

                                            <FormControl>
                                                <Select 
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    disabled={!isEditable}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o tipo"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="user">Usuário</SelectItem>
                                                        <SelectItem value="admin">Administrador</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>

                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" className="cursor-pointer">Cancelar</Button>
                                </DialogClose>

                                {dialogAction !== "view" ? (
                                    <Button type="submit" className="cursor-pointer">Confirmar</Button>
                                ) : (null)}
                            </DialogFooter>
                        </form>
                    </Form>
                ) : (null)}

                {dialogAction === 'delete' ? (
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" className="cursor-pointer">Cancelar</Button>
                        </DialogClose>

                        <Button variant="destructive" onClick={deleteUser} className="cursor-pointer">Confirmar exclusão</Button>
                    </DialogFooter>
                ) : (null)}
          </DialogContent>
        </Dialog>
    )
}
