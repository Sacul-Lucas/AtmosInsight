import { DefineApp } from "@/Core/Components/Utils/DefineApp";
import type { formSchema } from "@/Core/lib/utils/userFormSchema";
import { AuthForm } from "@/Core/Components/Forms/AuthForm";
import { RegisterUserAction } from "@/Core/Actions/AuthRegisterAction";
import { Toaster } from "@/Core/Components/shadcnComponents/Ui/sonner";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import appAuthIcon from "@/assets/icons/user-auth.svg";

export const Register = () => {
  const navigate = useNavigate()

  const handleSubmit = async (authValues: z.infer<typeof formSchema>) => {
    const { username, email, password } = authValues;

    const registerRes = await RegisterUserAction.execute({ username, email, password });
    const message = registerRes.data;

    switch (registerRes.status) {
      case "SUCCESS":
        toast.success(message, {
          duration: 1500,
          className: "!bg-emerald-700 !border-emerald-800 !text-white"
        });
        setTimeout(() => navigate("/Login"), 1500);
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

  return (
    <DefineApp
      appTitle="AtmosInsight - Registro"
      appIcon={appAuthIcon}
      bodyStyle="flex w-full min-h-dvh bg-no-repeat justify-center items-center"
    >
      <AuthForm formType="Register" formAction={handleSubmit} formMethod="POST" />

      <Toaster position="bottom-left"/>
    </DefineApp>
  );
};
