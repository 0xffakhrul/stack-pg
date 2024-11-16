import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/axios";

export const LogoutButton = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth-user"], null);
      queryClient.removeQueries();
      toast.success("Logged out successfully!");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      toast.error("Failed to logout. Please try again.");
    },
  });

  return (
    <button
      onClick={() => logout()}
      disabled={isPending}
      className="px-4 py-2 text-sm font-medium text-white gap-2 rounded-sm duration-200 border border-zinc-600 hover:border-zinc-500 focus:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 outline-none"
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
};
