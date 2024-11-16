import { Bookmark } from "../types/index";
import * as Popover from '@radix-ui/react-popover';
import { MoreVertical, Trash2 } from 'lucide-react';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete?: (id: string) => void;
}

export const BookmarkCard = ({ bookmark, onDelete }: BookmarkCardProps) => {
  return (
    <div className="bg-zinc-900 p-4 rounded-sm border border-zinc-600 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {bookmark.favicon && (
            <img src={bookmark.favicon} alt="favicon" className="w-4 h-4" />
          )}
          <h3 className="text-lg font-semibold text-white">{bookmark.title}</h3>
        </div>
        
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="text-gray-400 hover:text-gray-300">
              <MoreVertical size={20} />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="bg-zinc-800 rounded-md shadow-lg p-2 z-50">
              <button
                onClick={() => onDelete?.(bookmark.id)}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 px-3 py-2 rounded hover:bg-zinc-700 w-full"
              >
                <Trash2 size={16} />
                Delete
              </button>
              <Popover.Arrow className="fill-zinc-800" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      <p className="text-gray-400 mt-2">{bookmark.description}</p>
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 mt-2 inline-block"
      >
        Visit site
      </a>
      <div className="flex gap-2 mt-2">
        {bookmark.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-700 px-2 py-1 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
