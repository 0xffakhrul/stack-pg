import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { Bookmark } from "../types/index";
import { BookmarkCard } from "./BookmarkCard";
import toast from "react-hot-toast";

export const BookmarkList = () => {
  const queryClient = useQueryClient();

  const {
    data: bookmarks,
    isLoading,
    error,
  } = useQuery<Bookmark[]>({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const response = await api.get("/bookmarks");
      return response.data;
    },
  });

  const deleteBookmarkMutation = useMutation({
    mutationFn: async (bookmarkId: string) => {
      await api.delete(`/bookmarks/${bookmarkId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const handleDelete = (bookmarkId: string) => {
    toast.promise(deleteBookmarkMutation.mutateAsync(bookmarkId), {
      loading: "Deleting bookmark...",
      success: "Bookmark deleted successfully!",
      error: "Failed to delete bookmark!!! RAAAAHHHHHH",
    });
  };

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading bookmarks!</div>;
  }

  if (!bookmarks?.length) {
    return <div className="text-white">No bookmarks found!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};
