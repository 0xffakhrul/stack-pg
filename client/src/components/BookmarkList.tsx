import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { Bookmark } from "../types/index";
import { BookmarkCard } from "./BookmarkCard";
import toast from "react-hot-toast";
import { useState, useMemo } from "react";
import { X } from "lucide-react";

export const BookmarkList = () => {
  const queryClient = useQueryClient();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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

  //filtering
  const allTags = useMemo(() => {
    if (!bookmarks) return [];
    const tagSet = new Set<string>();

    bookmarks.forEach((bookmark) => {
      bookmark.tags.forEach((tag) => tagSet.add(tag));
    });

    return Array.from(tagSet);
  }, [bookmarks]);

  //filtering
  const filteredBookmarks = useMemo(() => {
    if (!selectedTag) return bookmarks;
    return bookmarks?.filter((bookmark) => bookmark.tags.includes(selectedTag));
  }, [bookmarks, selectedTag]);

  const deleteBookmarkMutation = useMutation({
    mutationFn: async (bookmarkId: string) => {
      await api.delete(`/bookmarks/${bookmarkId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const updateTagsMutation = useMutation({
    mutationFn: async ({ id, tags }: { id: string; tags: string[] }) => {
      const response = await api.patch(`/bookmarks/${id}/tags`, { tags });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const handleDelete = (bookmarkId: string) => {
    toast.promise(deleteBookmarkMutation.mutateAsync(bookmarkId), {
      loading: "Deleting bookmark...",
      success: "Bookmark deleted successfully!",
      error: "Failed to delete bookmark!",
    });
  };

  const handleUpdateTags = (id: string, newTags: string[]) => {
    toast.promise(updateTagsMutation.mutateAsync({ id, tags: newTags }), {
      loading: "Updating tags...",
      success: "Tags updated successfully!",
      error: "Failed to update tags!",
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
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            className={`px-3 py-1.5 rounded-sm text-sm flex items-center gap-2
              ${
                tag === selectedTag
                  ? "bg-zinc-300 text-zinc-600"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
          >
            {tag}
            {tag === selectedTag && <X size={14} className="text-zinc-600" />}
          </button>
        ))}
      </div>

      {/* Bookmarks grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBookmarks?.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onDelete={handleDelete}
            onUpdateTags={handleUpdateTags}
          />
        ))}
      </div>

      {/* Show message when no bookmarks match the selected tag */}
      {selectedTag && filteredBookmarks?.length === 0 && (
        <div className="text-zinc-400 text-center py-8">
          No bookmarks found with tag: {selectedTag}
        </div>
      )}
    </div>
  );
};
