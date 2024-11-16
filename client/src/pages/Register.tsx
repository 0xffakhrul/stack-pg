import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { api } from "../lib/axios";
import toast from "react-hot-toast";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function Register() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterForm) => api.post("/auth/register", data),
    onSuccess: (response) => {
      queryClient.setQueryData(["auth-user"], response.data);
      toast.success("Registered successfully!");
      navigate("/", { replace: true });
    },
    onError: () => {
      toast.error("Registration failed. Email might already be registered.");
    },
  });

  return (
    <div className="max-w-md mx-auto">
      <div className="space-y-3 pt-16 flex flex-col items-center">
        <h1 className="text-5xl font-bold text-white">Stack</h1>
        <h1 className="text-2xl font-bold text-zinc-300">
          Join Stack Today
        </h1>
      </div>
      <form
        onSubmit={handleSubmit((data) => registerMutation.mutate(data))}
        className="pt-7"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white pb-3">
              Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="rounded-sm bg-transparent border border-zinc-600 py-2 px-4 w-full text-white"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

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
            disabled={registerMutation.isPending}
            className="bg-zinc-700 w-full flex justify-center py-2 px-4 border border-zinc-600 rounded-sm text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {registerMutation.isPending ? "Loading..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}
