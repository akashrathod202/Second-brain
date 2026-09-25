
type ContentCardProps = {
    content: Content;
  };
  
  
  export const ContentCard = ({ content }: ContentCardProps) => {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition">
  
        {/* Type */}
  
        <div className="flex items-center justify-between mb-4">
  
          <span className="text-xs font-medium uppercase text-indigo-600">
            {content.type}
          </span>
  
        </div>
  
  
        {/* Title */}
  
        <h2 className="text-lg font-semibold text-slate-900">
          {content.title}
        </h2>
  
  
        {/* Link */}
  
        {content.link && (
          <p className="mt-3 text-sm text-slate-500 truncate">
            {content.link}
          </p>
        )}
  
  
        {/* Tags */}
  
        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
  
            {content.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md bg-slate-100 text-xs text-slate-600"
              >
                #{tag}
              </span>
            ))}
  
          </div>
        )}
  
  
        {/* Date */}
  
        <p className="mt-5 text-xs text-slate-400">
          {new Date(content.createdAt).toLocaleDateString()}
        </p>
  
      </div>
    );
  };
  