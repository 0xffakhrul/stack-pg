import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/axios";
import toast from "react-hot-toast";
import { Loading } from "../components/Loading";
import { useAuth } from "../context/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginForm) => api.post("/auth/login", data),
    onSuccess: (response) => {
      queryClient.setQueryData(["auth-user"], response.data);
      toast.success("Logged in successfully!");
      navigate("/", { replace: true });
    },
    onError: () => {
      toast.error("Invalid email or password");
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="space-y-3 pt-16 flex flex-col items-center">
        <h1 className="text-5xl font-bold text-white">Stack</h1>
        <h1 className="text-2xl font-bold text-zinc-300">
          Save. Organize. Manage.
        </h1>
      </div>
      <form
        onSubmit={handleSubmit((data) => loginMutation.mutate(data))}
        className="pt-7"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white pb-3">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="rounded-sm bg-transparent border border-zinc-600 py-2 px-4 w-full text-white"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div> 
            <label className="block text-sm font-medium text-white pb-3">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="rounded-sm bg-transparent border border-zinc-600 py-2 px-4 w-full text-white"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="bg-zinc-700 w-full flex justify-center py-2 px-4 border border-zinc-600 rounded-sm text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? "Loading..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
