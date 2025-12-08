import { DefineApp } from "@/Core/Components/Utils/DefineApp";
import { formSchema } from "@/Core/Components/Forms/AuthForm";
import { AuthForm } from "@/Core/Components/Forms/AuthForm";
import { AuthUserAction } from "@/Core/Actions/AuthUserAction";
import { Toaster } from "@/Core/Components/shadcnComponents/Ui/sonner";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"
import { z } from "zod";
import appAuthIcon from "@/assets/icons/user-auth.svg";

export const Login = () => {
  const navigate = useNavigate()

  const handleSubmit = async (authValues: z.infer<typeof formSchema>) => {
    const { email, password } = authValues;

    const authRes = await AuthUserAction.execute({ email, password });
    const message = authRes.data;

    switch (authRes.status) {
      case "SUCCESS":
        localStorage.setItem("token", authRes.token!.toString());
        toast.success(message, {
          duration: 1500,
          className: "!bg-emerald-700 !border-emerald-800 !text-white"
        });
        setTimeout(() => navigate("/"), 1500);
        break;

      case "EMAIL_NOT_FOUND":
      case "INVALID_PASSWORD":
      case "UNKNOWN":
        toast.error(message, {
          className: "!bg-red-700 !border-red-800 !text-white !align-middle"
        });
        break;

      default:
        toast.error("Não foi possível fazer login no momento. Tente novamente mais tarde.", {
          className: "!bg-red-700 !border-red-800 !text-white"
        });
        break;
    }
  };

  return (
    <DefineApp
      appTitle="AtmosInsight - Login"
      appIcon={appAuthIcon}
      bodyStyle="flex bg-white w-full min-h-dvh bg-no-repeat justify-center items-center"
    >
      <AuthForm formType="Login" formAction={handleSubmit} formMethod="POST" />

      <Toaster position="bottom-left"/>
    </DefineApp>
  );
};
