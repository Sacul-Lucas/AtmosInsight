import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Core/Components/shadcnComponents/Ui/form.tsx"
import {
  Eye,
  EyeClosed
} from "lucide-react"
import { Button } from "@/Core/Components/shadcnComponents/Ui/button.tsx"
import { Input } from "@/Core/Components/shadcnComponents/Ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Link } from "react-router-dom";
import { useState } from "react"
import { z } from "zod"
import bgWeatherImg from "@/assets/img/pexels-pixabay-209831.jpg"

const passwordValidation = z
    .string()
    .min(8, {
      message: "A senha deve possuir ao menos 8 caracteres",
    })
    .regex(/[a-z]/, {
      message: "A senha deve conter pelo menos uma letra minúscula",
    })
    .regex(/[A-Z]/, {
      message: "A senha deve conter pelo menos uma letra maiúscula",
    })
    .regex(/[0-9]/, {
      message: "A senha deve conter pelo menos um número",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "A senha deve conter pelo menos um caractere especial",
    });

export const formSchema = z.object({
    username: z
        .string()
        .min(2, {
          message: "Nome de usuário deve possuir ao menos 2 caracteres",
        })
        .max(50, {
          message: "Nome de usuário não pode ter mais de 50 caracteres",
        })
        .optional()
        .or(z.literal("")),

    email: z
        .email("O email inserido é inválido")
        .min(12, {
          message: "Email deve possuir ao menos 12 caracteres",
        }),

    password: passwordValidation,
});

interface AuthFormProps {
    formAction: SubmitHandler<{ username?: string | undefined; email: string; password: string; }>;
    formType: string;
    formMethod: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
    formAction,
    formType,
    formMethod,
}) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        },
    })

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex min-h-dvh">
            <div className="flex relative w-full justify-center items-center">
                <div className="flex flex-col justify-center items-start gap-16">
                    <div className="flex flex-col gap-2">
                        {formType == 'Login' ? (
                            <div>
                                <h1 className="text-4xl">Bem vindo de volta!</h1>
                                <p>Insira suas informações para acessar sua conta</p>
                            </div>
                        ) : (
                            <div>
                                <h1 className="text-4xl">Comece agora</h1>
                                <p>Registre-se para começar a ter insights sobre o clima</p>
                            </div>
                        )}
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(formAction)} id={formType} method={formMethod} className="space-y-4 w-[30dvw]">
                            {formType === 'Register' && (
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome de usuário</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Insira seu nome de usuário" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                {formType == 'Register' && ('Nome que será exibido durante o uso da plataforma')}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Insira seu email" {...field} type="email" />
                                        </FormControl>
                                        <FormDescription>
                                            {formType == 'Register' && ('Email que será usado para acessar sua conta')}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>
                                        <div className="relative">
                                          <FormControl>
                                            <Input
                                              placeholder="Insira sua senha"
                                              {...field}
                                              type={showPassword ? "text" : "password"}
                                              className="pr-10" // espaço para o botão
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
                                        <FormDescription>
                                            {formType == 'Register' && ('Senha que será usada para acessar sua conta')}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button id={formType == 'Login' ? 'loginBtt' : 'registerBtt'} type="submit" className="w-full bg-emerald-700 cursor-pointer">
                                {formType == 'Login' ? ('Entrar') : ('Criar conta')}
                            </Button>
                        </form>
                    </Form>

                    <div className="inline-flex align-middle justify-center items-center w-full">
                        <hr className="w-1/2 h-0.5 mr-10 bg-neutral-300 border-0 rounded-sm" />
                        <div className="absolute px-4 -translate-x-1/2 left-1/2">
                            <p>Ou</p>
                        </div>
                        <hr className="w-1/2 h-0.5 bg-neutral-300 border-0 rounded-sm" />
                    </div>
                          
                    <div className="inline-flex align-middle justify-center items-center w-full">
                        {formType == 'Login' ? (
                            <span>Ainda não tem uma conta? <Link to="/Register" className="no-underline hover:underline text-emerald-700">Cadastre-se</Link></span>
                        ) : (
                            <span>Já possui uma conta? <Link to="/Login" className="no-underline hover:underline text-emerald-700">Entrar</Link></span>
                        )}
                    </div>
                </div>
            </div>
                          
            <div className="flex relative w-full">
                <img
                  className="rounded-s-2xl object-cover"
                  src={bgWeatherImg}
                />
            </div>
        </div>
    )
}