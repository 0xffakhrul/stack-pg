import { BookmarkForm } from "../components/BookmarkForm";
import { BookmarkList } from "../components/BookmarkList";
import { Loading } from "../components/Loading";
import { useAuth } from "../context/auth";

export const Home = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center space-y-5">
        <h2 className="text-2xl font-bold text-white text-center">
          Add New Bookmark
        </h2>
        <BookmarkForm />
      </div>
      <div className="flex flex-col items-center space-y-5">
        <h2 className="text-2xl font-bold text-white pt-14">My Bookmarks</h2>
        <BookmarkList />
      </div>
    </div>
  );
};
