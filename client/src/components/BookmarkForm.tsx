import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "../lib/axios";

export const BookmarkForm = () => {
  const [url, setUrl] = useState("");
  const queryClient = useQueryClient();

  const { mutate: addBookmark, isPending } = useMutation({
    mutationFn: async (url: string) => {
      const response = await api.post("/bookmarks", {
        url,
        tags: [],
      });
      return response.data;
    },
    onSuccess: () => {
      setUrl("");
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: (error) => {
      console.error("Error adding bookmark:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    toast.promise(
      new Promise((resolve) => {
        addBookmark(url, { onSuccess: resolve });
      }),
      {
        loading: "Adding bookmark...",
        success: "Bookmark added successfully!",
        error: "Failed to add bookmark. Please try again.",
      }
    );
  };

  return (
    <div className="w-full max-w-md">
      <form className="flex gap-3" onSubmit={handleSubmit}>
        <input
          className="rounded-sm bg-transparent border border-zinc-600 py-2 px-4 w-full text-white"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://"
          required
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-sm py-2 px-4 text-white border border-zinc-600 hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
};
