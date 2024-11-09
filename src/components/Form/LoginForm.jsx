import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "../../services/auth";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import WarningDialogReset from "../ui/WarningDialogReset";
import ChangePasswordDialog from "../ui/ChangePasswordDialog";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(5, {
    message: "Password must be at least 8 characters.",
  }),
});

export const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values) {
    login(values)
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = error.data?.detail || "An unknown error occurred";
        setLoginError(errorMessage);
      });
  }

  return (
    <div className="md:w-[400px] w-full p-6 bg-white rounded-lg md:shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <p className="text-[1E293B] mb-4">
        Don’t have an account?{" "}
        <Link relative="path" to="/signup" href="#" className="text-accent">
          Sign up
        </Link>
      </p>
      {loginError && <p className="text-red-500 mb-4">{loginError}</p>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...field}
                    className="w-full"
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Password"
                      {...field}
                      type={showPassword ? "text" : "password"}
                      className="w-full pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-start">
            <WarningDialogReset />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </form>
      </Form>
      <ChangePasswordDialog />
    </div>
  );
};
