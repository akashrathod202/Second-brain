import LibraryItemCard from "./LibraryItemCard";
import type { LibraryItem } from "./Library";

type Props = {
  items: LibraryItem[];
  onFavorite: (id: string) => void;
};

const RecentItems = ({
  items,
  onFavorite,
}: Props) => {
  return (
    <section className="mt-8 pb-10">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-lg font-semibold">
            Your Knowledge
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            {items.length} items in your library
          </p>
        </div>

      </div>

      {items.length === 0 ? (
        <div
          className="
            mt-5
            rounded-2xl
            border border-dashed
            border-zinc-800
            bg-zinc-900/50
            p-16
            text-center
          "
        >
          <p className="font-medium">
            No items found
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <LibraryItemCard
              key={item.id}
              item={item}
              onFavorite={onFavorite}
            />
          ))}
        </div>
      )}

    </section>
  );
};

export default RecentItems;