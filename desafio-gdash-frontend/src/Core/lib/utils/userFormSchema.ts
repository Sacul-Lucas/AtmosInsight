import { z } from "zod"

export const passwordValidation = z
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

    usertype: z
        .string()
        .min(4, {
          message: "Tipo de usuário deve possuir ao menos 4 caracteres",
        })
        .optional()
        .or(z.literal(""))
});