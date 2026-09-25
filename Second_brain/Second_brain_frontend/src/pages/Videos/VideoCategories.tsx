
interface VideoCategoriesProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const VideoCategories = ({
  categories,
  selectedCategory,
  onCategoryChange,
}: VideoCategoriesProps) => {
  return (
    <div>
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Categories
        </p>

        <h2 className="mt-1 text-lg font-semibold">
          Browse your knowledge
        </h2>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const isActive = category === selectedCategory;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`
                whitespace-nowrap
                rounded-xl
                border
                px-4
                py-2
                text-sm
                transition
                ${
                  isActive
                    ? "border-amber-400/30 bg-amber-400 text-black"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white"
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VideoCategories;

